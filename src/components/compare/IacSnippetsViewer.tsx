import React, { useState } from 'react';
import type { ServiceEntry } from '../../types/cloud';
import { PlatformBadge } from '../common/PlatformBadge';
import { Copy, Check, Code2 } from 'lucide-react';

interface IacSnippetsViewerProps {
  azureService: ServiceEntry;
  awsService: ServiceEntry;
}

export const IacSnippetsViewer: React.FC<IacSnippetsViewerProps> = ({
  azureService,
  awsService
}) => {
  const [activeTab, setActiveTab] = useState<'terraform' | 'bicep_cfn'>('terraform');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Terraform HCL snippet based on service category and name
  const getAzureTerraform = (service: ServiceEntry): string => {
    const name = service.serviceName.toLowerCase();
    if (name.includes('blob') || name.includes('storage')) {
      return `resource "azurerm_resource_group" "rg" {
  name     = "rg-cloudcompare-demo"
  location = "East US"
}

resource "azurerm_storage_account" "storage" {
  name                     = "stcloudcompare001"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  enable_https_traffic_only = true

  tags = {
    Environment = "Production"
    Engine      = "CloudCompare"
  }
}`;
    } else if (name.includes('virtual') || name.includes('vm')) {
      return `resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-cloudcompare"
  resource_group_name = "rg-cloudcompare-demo"
  location            = "East US"
  size                = "Standard_D2s_v5"
  admin_username      = "azureuser"

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}`;
    } else if (name.includes('cosmos') || name.includes('sql') || name.includes('database')) {
      return `resource "azurerm_cosmosdb_account" "db" {
  name                = "cosmos-cloudcompare-demo"
  location            = "East US"
  resource_group_name = "rg-cloudcompare-demo"
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = "East US"
    failover_priority = 0
  }
}`;
    } else if (name.includes('function') || name.includes('app service')) {
      return `resource "azurerm_service_plan" "plan" {
  name                = "asp-cloudcompare"
  resource_group_name = "rg-cloudcompare"
  location            = "East US"
  os_type             = "Linux"
  sku_name            = "Y1" # Consumption
}

resource "azurerm_linux_function_app" "func" {
  name                = "fn-cloudcompare-demo"
  resource_group_name = "rg-cloudcompare"
  location            = "East US"
  storage_account_name = "stcloudcompare001"
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      node_version = "20"
    }
  }
}`;
    } else {
      return `# Azure Resource Definition
resource "azurerm_generic_resource" "res" {
  name                = "res-${service.serviceName.toLowerCase().replace(/[^a-z0-0]/g, '')}"
  location            = "East US"
  resource_group_name = "rg-cloudcompare-demo"
  
  tags = {
    Service     = "${service.serviceName}"
    Category    = "${service.category}"
    Environment = "Production"
  }
}`;
    }
  };

  const getAwsTerraform = (service: ServiceEntry): string => {
    const name = service.serviceName.toLowerCase();
    if (name.includes('s3') || name.includes('storage')) {
      return `resource "aws_s3_bucket" "storage" {
  bucket        = "s3-cloudcompare-demo-001"
  force_destroy = true

  tags = {
    Environment = "Production"
    Engine      = "CloudCompare"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "enc" {
  bucket = aws_s3_bucket.storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`;
    } else if (name.includes('ec2') || name.includes('instance')) {
      return `resource "aws_instance" "vm" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t3.medium"
  key_name      = "cloudcompare-key"

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  tags = {
    Name        = "ec2-cloudcompare"
    Environment = "Production"
  }
}`;
    } else if (name.includes('dynamodb') || name.includes('rds') || name.includes('database')) {
      return `resource "aws_dynamodb_table" "db" {
  name           = "dynamo-cloudcompare-demo"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Environment = "Production"
    Engine      = "CloudCompare"
  }
}`;
    } else if (name.includes('lambda') || name.includes('function')) {
      return `resource "aws_lambda_function" "func" {
  function_name = "fn-cloudcompare-demo"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "function.zip"

  environment {
    variables = {
      ENV = "Production"
    }
  }
}`;
    } else {
      return `# AWS Resource Definition
resource "aws_resource" "res" {
  name = "res-${service.serviceName.toLowerCase().replace(/[^a-z0-0]/g, '')}"

  tags = {
    Service     = "${service.serviceName}"
    Category    = "${service.category}"
    Environment = "Production"
  }
}`;
    }
  };

  const getAzureBicep = (service: ServiceEntry): string => {
    return `@description('Location for all resources.')
param location string = resourceGroup().location

resource res 'Microsoft.Resources/deployments@2023-01-01' = {
  name: 'bicep-${service.serviceName.toLowerCase().replace(/[^a-z0-9]/g, '')}'
  location: location
  properties: {
    mode: 'Incremental'
  }
}`;
  };

  const getAwsCfn = (service: ServiceEntry): string => {
    return `AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudCompare AWS ${service.serviceName} Infrastructure Resource'
Resources:
  CloudCompareResource:
    Type: 'AWS::Custom::${service.serviceName.replace(/[^a-zA-Z0-9]/g, '')}'
    Properties:
      Environment: 'Production'`;
  };

  const azHcl = getAzureTerraform(azureService);
  const awsHcl = getAwsTerraform(awsService);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Code2 className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-mono">
              Infrastructure-as-Code (IaC) Snippets
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Production-ready Terraform HCL definitions for both cloud platforms
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('terraform')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'terraform'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Terraform HCL
          </button>
          <button
            onClick={() => setActiveTab('bicep_cfn')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'bicep_cfn'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bicep & CloudFormation
          </button>
        </div>
      </div>

      {/* Code Snippets Grid */}
      {activeTab === 'terraform' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Azure Terraform */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatformBadge platform="azure" size="sm" />
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {azureService.serviceName} (Terraform azurerm)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(azHcl, 'azHcl')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'azHcl' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-500" /> Copy HCL
                  </>
                )}
              </button>
            </div>
            <div className="relative rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre className="text-sky-300 leading-relaxed">{azHcl}</pre>
            </div>
          </div>

          {/* AWS Terraform */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatformBadge platform="aws" size="sm" />
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {awsService.serviceName} (Terraform aws)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(awsHcl, 'awsHcl')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'awsHcl' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-500" /> Copy HCL
                  </>
                )}
              </button>
            </div>
            <div className="relative rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre className="text-amber-300 leading-relaxed">{awsHcl}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Azure Bicep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatformBadge platform="azure" size="sm" />
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  Azure Bicep Template
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(getAzureBicep(azureService), 'bicep')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {copiedKey === 'bicep' ? 'Copied!' : 'Copy Bicep'}
              </button>
            </div>
            <div className="rounded-2xl bg-slate-950 text-sky-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{getAzureBicep(azureService)}</pre>
            </div>
          </div>

          {/* AWS CloudFormation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatformBadge platform="aws" size="sm" />
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  AWS CloudFormation YAML
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(getAwsCfn(awsService), 'cfn')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {copiedKey === 'cfn' ? 'Copied!' : 'Copy CFN'}
              </button>
            </div>
            <div className="rounded-2xl bg-slate-950 text-amber-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{getAwsCfn(awsService)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
