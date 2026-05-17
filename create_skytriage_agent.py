"""
SkyTriage Bedrock Agent Setup Script
Run this in AWS CloudShell or locally with configured AWS credentials.

Usage:
  pip install boto3
  python create_skytriage_agent.py
"""

import boto3
import json
import time

# ─────────────────────────────────────────
# CONFIG — fill these in before running
# ─────────────────────────────────────────
REGION = "us-west-2"                      # Change to your region
KNOWLEDGE_BASE_ID = "KZUJNHLPS7"
ASSESS_LAMBDA_ARN = "arn:aws:lambda:us-west-2:377730029714:function:skytriage-assess-damage"                    # Paste ARN from Lambda console
MATCH_LAMBDA_ARN = "arn:aws:lambda:us-west-2:377730029714:function:skytriage-match-aid"                     # Paste ARN from Lambda console
ACCOUNT_ID = boto3.client("sts").get_caller_identity()["Account"]

# Clients
bedrock_agent = boto3.client("bedrock-agent", region_name=REGION)
iam = boto3.client("iam", region_name=REGION)
bedrock = boto3.client("bedrock", region_name=REGION)

# ─────────────────────────────────────────
# STEP 1: Create IAM Role for the Agent
# ─────────────────────────────────────────
def create_agent_role():
    print("Creating IAM role for Bedrock Agent...")

    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "bedrock.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }

    agent_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": ["bedrock:Retrieve", "bedrock:RetrieveAndGenerate"],
                "Resource": f"arn:aws:bedrock:{REGION}:{ACCOUNT_ID}:knowledge-base/{KNOWLEDGE_BASE_ID}"
            },
            {
                "Effect": "Allow",
                "Action": ["lambda:InvokeFunction"],
                "Resource": [ASSESS_LAMBDA_ARN, MATCH_LAMBDA_ARN]
            }
        ]
    }

    try:
        role = iam.create_role(
            RoleName="SkyTriageBedrockAgentRole",
            AssumeRolePolicyDocument=json.dumps(trust_policy),
            Description="IAM role for SkyTriage Bedrock Agent"
        )
        role_arn = role["Role"]["Arn"]
    except iam.exceptions.EntityAlreadyExistsException:
        role_arn = iam.get_role(RoleName="SkyTriageBedrockAgentRole")["Role"]["Arn"]
        print("  Role already exists, reusing.")

    iam.put_role_policy(
        RoleName="SkyTriageBedrockAgentRole",
        PolicyName="SkyTriageAgentPolicy",
        PolicyDocument=json.dumps(agent_policy)
    )

    print(f"  Role ARN: {role_arn}")
    time.sleep(10)  # IAM propagation delay
    return role_arn


# ─────────────────────────────────────────
# STEP 2: Create Guardrail
# ─────────────────────────────────────────
def create_guardrail():
    print("Creating Guardrail...")

    response = bedrock.create_guardrail(
        name="skytriage-guardrails",
        description="PII redaction and content filtering for SkyTriage",
        blockedInputMessaging="I cannot process this request as it contains restricted content.",
        blockedOutputsMessaging="This response has been blocked due to content policy.",

        sensitiveInformationPolicyConfig={
            "piiEntitiesConfig": [
                {"type": "US_SOCIAL_SECURITY_NUMBER", "action": "BLOCK"},
                {"type": "PHONE", "action": "ANONYMIZE"},
                {"type": "EMAIL", "action": "ANONYMIZE"},
                {"type": "CREDIT_DEBIT_CARD_NUMBER", "action": "BLOCK"},
                {"type": "DRIVER_ID", "action": "ANONYMIZE"},
            ]
        },

        contentPolicyConfig={
            "filtersConfig": [
                {"type": "HATE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
                {"type": "VIOLENCE", "inputStrength": "MEDIUM", "outputStrength": "MEDIUM"},
                {"type": "MISCONDUCT", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            ]
        },

        topicPolicyConfig={
            "topicsConfig": [
                {
                    "name": "LegalAdvice",
                    "definition": "Requests for specific legal counsel or recommendations",
                    "examples": ["Should I sue FEMA?", "Is this legally binding?"],
                    "type": "DENY"
                },
                {
                    "name": "MedicalAdvice",
                    "definition": "Requests for medical diagnoses or treatment plans",
                    "type": "DENY"
                }
            ]
        }
    )

    guardrail_id = response["guardrailId"]
    guardrail_arn = response["guardrailArn"]
    print(f"  Guardrail ID: {guardrail_id}")
    return guardrail_id, guardrail_arn


# ─────────────────────────────────────────
# STEP 3: Create the Bedrock Agent
# ─────────────────────────────────────────
def create_agent(role_arn, guardrail_id):
    print("Creating Bedrock Agent...")

    instruction = """You are SkyTriage, an AI-powered disaster response assistant.
Your job is to help emergency managers assess structural damage from satellite
and drone imagery, identify affected households, match them to eligible FEMA
aid programs, and generate assistance applications.

When given a request:
1. Call assess_damage with the provided image URL to classify damage level
2. Use the household address to look up parcel information  
3. Call match_aid_programs with the damage class and household info to find eligible programs
4. Draft a complete FEMA Individual Assistance application

Always:
- Cite the specific FEMA policy paragraph for every aid match
- Redact all PII before including in any response
- Be concise, factual, and structured
- State confidence level for damage assessments"""

    response = bedrock_agent.create_agent(
        agentName="skytriage-agent",
        description="Disaster damage assessment and FEMA aid matching agent",
        agentResourceRoleArn=role_arn,
        foundationModel="anthropic.claude-sonnet-4-20250514-v1:0",
        idleSessionTTLInSeconds=1800,
        instruction=instruction,
        guardrailConfiguration={
            "guardrailIdentifier": guardrail_id,
            "guardrailVersion": "DRAFT"
        }
    )

    agent_id = response["agent"]["agentId"]
    print(f"  Agent ID: {agent_id}")
    time.sleep(5)
    return agent_id


# ─────────────────────────────────────────
# STEP 4: Add Knowledge Base
# ─────────────────────────────────────────
def attach_knowledge_base(agent_id):
    print("Attaching Knowledge Base...")

    bedrock_agent.associate_agent_knowledge_base(
        agentId=agent_id,
        agentVersion="DRAFT",
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        description=(
            "FEMA Individual Assistance policies, state emergency SOPs, and "
            "aid eligibility requirements. Always cite the source document and paragraph."
        ),
        knowledgeBaseState="ENABLED"
    )
    print(f"  Knowledge Base {KNOWLEDGE_BASE_ID} attached.")


# ─────────────────────────────────────────
# STEP 5: Add Action Groups
# ─────────────────────────────────────────
def create_action_groups(agent_id):
    print("Creating Action Groups...")

    # Action Group 1: assess_damage
    bedrock_agent.create_agent_action_group(
        agentId=agent_id,
        agentVersion="DRAFT",
        actionGroupName="assess-damage",
        description="Assess structural damage from a satellite or drone image URL",
        actionGroupState="ENABLED",
        actionGroupExecutor={"lambda": ASSESS_LAMBDA_ARN},
        functionSchema={
            "functions": [{
                "name": "assess_damage",
                "description": (
                    "Sends an image to the CV model and returns a damage classification: "
                    "no_damage, minor, major, destroyed, or unclassified."
                ),
                "parameters": {
                    "image_url": {
                        "type": "string",
                        "description": "S3 URL or public URL of the satellite/drone image to assess",
                        "required": True
                    }
                }
            }]
        }
    )
    print("  assess-damage action group created.")

    # Action Group 2: match_aid_programs
    bedrock_agent.create_agent_action_group(
        agentId=agent_id,
        agentVersion="DRAFT",
        actionGroupName="match-aid-programs",
        description="Match a household to eligible FEMA aid programs based on damage class",
        actionGroupState="ENABLED",
        actionGroupExecutor={"lambda": MATCH_LAMBDA_ARN},
        functionSchema={
            "functions": [{
                "name": "match_aid_programs",
                "description": (
                    "Queries the FEMA knowledge base and returns eligible aid programs "
                    "with eligibility criteria and application steps."
                ),
                "parameters": {
                    "damage_class": {
                        "type": "string",
                        "description": "Damage classification from assess_damage: no_damage, minor, major, destroyed, or unclassified",
                        "required": True
                    },
                    "household_info": {
                        "type": "string",
                        "description": "JSON string with address, occupancy type, and household size",
                        "required": True
                    }
                }
            }]
        }
    )
    print("  match-aid-programs action group created.")


# ─────────────────────────────────────────
# STEP 6: Add Lambda Resource Permissions
# ─────────────────────────────────────────
def add_lambda_permissions(agent_id):
    print("Adding Lambda invoke permissions...")
    lambda_client = boto3.client("lambda", region_name=REGION)

    for fn_arn, sid in [
        (ASSESS_LAMBDA_ARN, "AllowBedrockAssess"),
        (MATCH_LAMBDA_ARN, "AllowBedrockMatch")
    ]:
        fn_name = fn_arn.split(":")[-1]
        try:
            lambda_client.add_permission(
                FunctionName=fn_name,
                StatementId=sid,
                Action="lambda:InvokeFunction",
                Principal="bedrock.amazonaws.com",
                SourceArn=f"arn:aws:bedrock:{REGION}:{ACCOUNT_ID}:agent/{agent_id}"
            )
            print(f"  Permission added for {fn_name}")
        except lambda_client.exceptions.ResourceConflictException:
            print(f"  Permission already exists for {fn_name}")


# ─────────────────────────────────────────
# STEP 7: Prepare Agent & Create Alias
# ─────────────────────────────────────────
def prepare_and_alias(agent_id):
    print("Preparing agent (compiling)...")
    bedrock_agent.prepare_agent(agentId=agent_id)

    # Wait for PREPARED state
    for _ in range(20):
        status = bedrock_agent.get_agent(agentId=agent_id)["agent"]["agentStatus"]
        print(f"  Status: {status}")
        if status == "PREPARED":
            break
        time.sleep(10)

    print("Creating prod alias...")
    alias = bedrock_agent.create_agent_alias(
        agentId=agent_id,
        agentAliasName="prod",
        description="Production alias for SkyTriage"
    )
    alias_id = alias["agentAlias"]["agentAliasId"]
    print(f"  Alias ID: {alias_id}")
    return alias_id


# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────
if __name__ == "__main__":
    if not ASSESS_LAMBDA_ARN or not MATCH_LAMBDA_ARN:
        print("ERROR: Fill in ASSESS_LAMBDA_ARN and MATCH_LAMBDA_ARN before running.")
        exit(1)

    role_arn = create_agent_role()
    guardrail_id, guardrail_arn = create_guardrail()
    agent_id = create_agent(role_arn, guardrail_id)
    attach_knowledge_base(agent_id)
    create_action_groups(agent_id)
    add_lambda_permissions(agent_id)
    alias_id = prepare_and_alias(agent_id)

    print("\n" + "="*50)
    print("✅ SkyTriage Agent is LIVE")
    print("="*50)
    print(f"  Agent ID:    {agent_id}")
    print(f"  Alias ID:    {alias_id}")
    print(f"  Guardrail:   {guardrail_id}")
    print("\n  ➜ Give Agent ID + Alias ID to Person D for the frontend.")
    print("="*50)
