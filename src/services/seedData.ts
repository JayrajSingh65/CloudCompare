import type { ServiceEntry, ComparisonPair } from '../types/cloud';

export const INITIAL_SERVICES: ServiceEntry[] = [
  // Pair 1: Object Storage
  {
    id: 'azure-blob-storage',
    platform: 'azure',
    serviceName: 'Azure Blob Storage',
    category: 'Storage',
    description: `Object storage solution for cloud-native workloads, unstructured data, data lakes, and backup storage. Offers massively scalable object storage with fine-grained lifecycle management and multiple access tiers.

### Key Concepts
- **Storage Account**: Top-level container for all data objects.
- **Container**: Organizes set of blobs, similar to a directory.
- **Blob Types**: Block Blobs (text/binary), Append Blobs (logs), and Page Blobs (VHD disk images).`,
    keyFeatures: [
      'Hot, Cool, Cold, and Archive Access Tiers',
      'Immutable Storage / Write Once Read Many (WORM)',
      'Data Lake Storage Gen2 (Hierarchical Namespace)',
      'Object Replication across regions',
      'Blob Lifecycle Management rules'
    ],
    pricingModel: 'Pay-per-GB per month based on access tier + read/write operations (10K units) + outbound data transfer.',
    configOptions: [
      { name: 'Redundancy', description: 'Replication mechanism across availability zones/regions', defaultValue: 'LRS (Locally Redundant Storage)' },
      { name: 'Access Tier', description: 'Default storage tier assigned to newly uploaded blobs', defaultValue: 'Hot' },
      { name: 'Hierarchical Namespace', description: 'Enables high-performance filesystem semantics for analytics', defaultValue: 'Disabled (Enable for ADLS Gen2)' },
      { name: 'Soft Delete Retention', description: 'Days deleted blobs remain recoverable before permanent purge', defaultValue: '7 days' },
      { name: 'Versioning', description: 'Automatically keep previous versions of overwritten blobs', defaultValue: 'Disabled' }
    ],
    equivalentServiceId: 'aws-s3',
    useCases: [
      'Big Data Analytics & Data Lakes',
      'Static Web Hosting & CDN Origin',
      'Enterprise Backup & Long-term Archiving',
      'Streaming Media Assets'
    ],
    limitations: [
      'Maximum single block blob size is 19.5 TB',
      'Flat namespace by default (simulated folders via slashes unless ADLS Gen2 enabled)'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction'
  },
  {
    id: 'aws-s3',
    platform: 'aws',
    serviceName: 'Amazon Simple Storage Service (S3)',
    category: 'Storage',
    description: `Industry-standard object storage service offering high availability, durability (99.999999999%), security, and performance for data storage of any scale.

### Key Concepts
- **Bucket**: Top-level container for objects; globally unique name required.
- **Object**: File and optional metadata up to 5 TB.
- **Storage Classes**: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Flexible Retrieval, Deep Archive.`,
    keyFeatures: [
      'S3 Intelligent-Tiering automatic cost optimization',
      'S3 Object Lock for WORM compliance',
      'Cross-Region (CRR) and Same-Region (SRR) Replication',
      'S3 Event Notifications (SNS, SQS, Lambda triggers)',
      'S3 Select & Glacier Select (in-place query filtering)'
    ],
    pricingModel: 'Pay per GB stored + requests (PUT, GET, LIST) + data transfer out. Intelligent-tiering adds small monitoring fee per object.',
    configOptions: [
      { name: 'Storage Class', description: 'Storage tier determined by access patterns and durability requirements', defaultValue: 'S3 Standard' },
      { name: 'Bucket Versioning', description: 'Preserves, retrieves, and restores every version of objects stored in bucket', defaultValue: 'Disabled' },
      { name: 'Block Public Access', description: 'Global bucket settings to prevent public access configurations', defaultValue: 'Enabled (All 4 settings)' },
      { name: 'Default Encryption', description: 'Automatic encryption method applied to new objects', defaultValue: 'SSE-S3 (AES-256)' },
      { name: 'Lifecycle Rules', description: 'Transition objects to cheaper tiers or expire after duration', defaultValue: 'None' }
    ],
    equivalentServiceId: 'azure-blob-storage',
    useCases: [
      'Cloud-Native Application Data Store',
      'Data Lakes & Analytics Source',
      'Disaster Recovery & Vault Storage',
      'Software Distribution Point'
    ],
    limitations: [
      'Maximum single object size limit is 5 TB',
      'Eventual consistency for overwrite PUTs and DELETEs historically (now strong consistency as of 2020)'
    ],
    documentationLink: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html'
  },

  // Pair 2: Serverless Functions
  {
    id: 'azure-functions',
    platform: 'azure',
    serviceName: 'Azure Functions',
    category: 'Compute',
    description: `Event-driven serverless compute service that runs code on demand without requiring explicit infrastructure provisioning. Supports multiple programming languages and built-in bindings.

### Key Concepts
- **Function App**: Execution context and deployment unit containing one or more functions.
- **Triggers & Bindings**: Declarative wire-up to Azure services (Cosmos DB, Event Hubs, Service Bus, Blob).
- **Durable Functions**: Stateful serverless workflows in code.`,
    keyFeatures: [
      'Durable Functions extension for orchestrations & state machines',
      'Declarative Triggers & Input/Output Bindings',
      'Consumption, Premium, and Dedicated App Service Hosting Plans',
      'Flex Consumption plan for fast cold starts & VNet integration',
      'Native support for C#, Python, Node.js, Java, PowerShell, and Custom Handlers'
    ],
    pricingModel: 'Consumption plan: Free tier includes 1 million executions + 400,000 GB-s memory per month. Pay per execution and execution time (GB-seconds).',
    configOptions: [
      { name: 'Hosting Plan', description: 'Infrastructure and scaling profile', defaultValue: 'Consumption (Y1)' },
      { name: 'Runtime Stack', description: 'Programming language runtime version', defaultValue: 'Node.js 20 LTS' },
      { name: 'Maximum Execution Timeout', description: 'Hard execution limit per function execution', defaultValue: '5 min (configurable to 10 min on Consumption)' },
      { name: 'Always On', description: 'Prevents cold starts by keeping instances warm', defaultValue: 'Disabled (Requires Premium/Dedicated plan)' },
      { name: 'VNet Integration', description: 'Connect function app to private Virtual Network', defaultValue: 'Supported on Premium / Flex Consumption' }
    ],
    equivalentServiceId: 'aws-lambda',
    useCases: [
      'Event-Driven API Endpoints',
      'Scheduled Micro-tasks & Data Cleanups',
      'Queue Processing & Stream Event Handlers',
      'Long-running Orchestration Workflows (Durable)'
    ],
    limitations: [
      'Default 5-minute timeout limit on Consumption plan (10 min max)',
      'Cold starts on consumption tier without pre-warmed instances'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/azure-functions/'
  },
  {
    id: 'aws-lambda',
    platform: 'aws',
    serviceName: 'AWS Lambda',
    category: 'Compute',
    description: `Serverless event-driven compute service that runs code in response to events and automatically manages underlying compute resources.

### Key Concepts
- **Function**: Code and configuration uploaded to Lambda.
- **Event Source**: AWS service or custom application triggering execution.
- **Lambda Layers**: Additional code libraries or data packaged separately.`,
    keyFeatures: [
      'Provisioned Concurrency for zero-cold start guarantee',
      'Lambda Function URLs (direct HTTP endpoints without API Gateway)',
      'AWS Step Functions integration for complex workflows',
      'Support for Container Images up to 10 GB',
      'Lambda SnapStart for Java applications fast cold start'
    ],
    pricingModel: '1M free requests + 3.2M seconds compute per month. Pay per request ($0.20 per 1M) and execution duration rounded to nearest millisecond.',
    configOptions: [
      { name: 'Memory Allocation', description: 'Memory size (128 MB to 10,240 MB); CPU scales proportionally', defaultValue: '512 MB' },
      { name: 'Timeout', description: 'Maximum execution window before Lambda aborts invocation', defaultValue: '3 seconds (max 15 minutes)' },
      { name: 'Architecture', description: 'Instruction set architecture (x86_64 vs arm64 Graviton2)', defaultValue: 'arm64 (Graviton2)' },
      { name: 'Ephemeral Storage (/tmp)', description: 'Temporary scratch space size allocated to function', defaultValue: '512 MB (scalable up to 10,240 MB)' },
      { name: 'Reserved Concurrency', description: 'Maximum concurrent invocations allocated to function', defaultValue: 'Unreserved (Shares pool limit 1000)' }
    ],
    equivalentServiceId: 'azure-functions',
    useCases: [
      'REST & GraphQL Serverless APIs',
      'S3 File Processing & Transformations',
      'Real-time Stream Processing (DynamoDB / Kinesis)',
      'Automated DevOps Tasks & CloudWatch Alarms'
    ],
    limitations: [
      'Hard 15-minute execution timeout',
      'Maximum deployment package size 50 MB (zipped) / 250 MB (unzipped) / 10 GB (container image)'
    ],
    documentationLink: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html'
  },

  // Pair 3: IaaS Virtual Machines
  {
    id: 'azure-vm',
    platform: 'azure',
    serviceName: 'Azure Virtual Machines',
    category: 'Compute',
    description: `On-demand, scalable IaaS virtual machines providing full control over operating system, compute hardware, networking, and storage configs.

### Key Concepts
- **VM Series**: B-series (burstable), D-series (general compute), E-series (memory optimized), F-series (compute optimized), NC/ND-series (GPU).
- **Virtual Network (VNet)**: Isolated private network boundary.
- **Managed Disks**: Ultra, Premium SSD, Standard SSD, Standard HDD.`,
    keyFeatures: [
      'Azure Spot VMs (up to 90% discount for interruptible workloads)',
      'Virtual Machine Scale Sets (VMSS) for auto-scaling',
      'Azure Hybrid Benefit (use existing Windows Server/SQL Server licenses)',
      'Accelerated Networking (SR-IOV up to 30 Gbps)',
      'Azure Confidential VMs (Hardware-based TEE encryption)'
    ],
    pricingModel: 'Per-second billing with 1-minute minimum. Pay-as-you-go, 1 or 3-year Reserved Instances (up to 72% savings), or Spot instances.',
    configOptions: [
      { name: 'VM Size / SKU', description: 'CPU count, RAM, network bandwidth, and IOPS limit', defaultValue: 'Standard_D2s_v5 (2 vCPU, 8 GB RAM)' },
      { name: 'OS Disk Type', description: 'Underlying disk storage tier for operating system', defaultValue: 'Premium SSD (P10)' },
      { name: 'Availability Options', description: 'Redundancy mechanism for uptime SLAs', defaultValue: 'Availability Zone (99.99% SLA)' },
      { name: 'Accelerated Networking', description: 'SR-IOV bypasses virtual switch for low latency', defaultValue: 'Enabled' },
      { name: 'Public IP SKU', description: 'Static vs Dynamic IPv4 allocation type', defaultValue: 'Standard SKU (Static)' }
    ],
    equivalentServiceId: 'aws-ec2',
    useCases: [
      'Enterprise Windows & Linux Server Workloads',
      'Legacy Monolithic Software Migration',
      'High Performance Computing (HPC) & GPU Workloads',
      'Self-Hosted Database Clusters'
    ],
    limitations: [
      'Stop action in portal defaults to "Deallocate" (releases public IP unless static)',
      'Complex SKU selection naming compared to EC2 instance types'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/virtual-machines/'
  },
  {
    id: 'aws-ec2',
    platform: 'aws',
    serviceName: 'Amazon Elastic Compute Cloud (EC2)',
    category: 'Compute',
    description: `Flexible and customizable Virtual Private Cloud compute capacity in the cloud with complete root administrative access to Linux or Windows instances.

### Key Concepts
- **Instance Types**: T4g/M6i (General Purpose), C6i (Compute), R6i (Memory), I3en (Storage), P4d (GPU).
- **AMI (Amazon Machine Image)**: Pre-configured template containing OS and software.
- **EBS (Elastic Block Store)**: Network-attached persistent block storage volumes.`,
    keyFeatures: [
      'AWS Graviton3 ARM-based custom processors (superior price/performance)',
      'EC2 Auto Scaling Groups (ASG) with target tracking policies',
      'EC2 Savings Plans and Reserved Instances',
      'Nitro System hardware offloading for near-bare-metal efficiency',
      'Placement Groups (Cluster, Spread, Partition)'
    ],
    pricingModel: 'Per-second billing for Linux/Windows. Options: On-Demand, Savings Plans (1-3 yr), Reserved Instances, Spot Instances (up to 90% off).',
    configOptions: [
      { name: 'Instance Type', description: 'Hardware family and sizing specification', defaultValue: 'm6i.large (2 vCPU, 8 GB RAM)' },
      { name: 'EBS Volume Type', description: 'Storage volume technology and IOPS guarantee', defaultValue: 'gp3 (3,000 IOPS baseline)' },
      { name: 'Tenancy', description: 'Shared hardware vs Dedicated host instance', defaultValue: 'Shared' },
      { name: 'Credit Specification', description: 'Burstable performance mode for T-family instances', defaultValue: 'Unlimited' },
      { name: 'Detailed Monitoring', description: 'CloudWatch 1-minute metric collection interval', defaultValue: 'Disabled (5-min default)' }
    ],
    equivalentServiceId: 'azure-vm',
    useCases: [
      'Scalable Web & Application Servers',
      'Custom Microservice Deployments',
      'Distributed Big Data Clusters (Hadoop/Spark)',
      'Game Server Infrastructure'
    ],
    limitations: [
      'EBS volumes are AZ-bound (cannot attach across Availability Zones without EBS Multi-Attach limitations)',
      'Complex billing structure across instances, data transfer, and EBS volumes'
    ],
    documentationLink: 'https://docs.aws.amazon.com/ec2/index.html'
  },

  // Pair 4: Managed Relational Database
  {
    id: 'azure-sql-db',
    platform: 'azure',
    serviceName: 'Azure SQL Database',
    category: 'Database',
    description: `Fully managed relational PaaS database engine powered by Microsoft SQL Server engine with built-in high availability, backups, and AI-powered performance tuning.

### Key Concepts
- **DTU vs vCore Model**: Choice between bundled resource units (DTU) or configurable vCore/RAM.
- **Hyperscale Tier**: Rapidly scales up to 100 TB database size with instant backups.
- **Serverless Tier**: Auto-scales vCores based on workload demand and pauses during inactive periods.`,
    keyFeatures: [
      'Automatic Tuning (AI recommendations & auto-indexing)',
      'Serverless auto-scaling and auto-pausing',
      'Hyperscale architecture (100 TB+ with sub-minute backups)',
      'Active Geo-Replication & Auto-Failover Groups',
      'Always Encrypted with secure enclaves'
    ],
    pricingModel: 'vCore provisioned or serverless per-second compute billing + storage GB-month. DTU bundled models also available.',
    configOptions: [
      { name: 'Purchasing Model', description: 'vCore (flexible hardware) vs DTU (bundled performance)', defaultValue: 'vCore Model' },
      { name: 'Service Tier', description: 'Performance and availability tier', defaultValue: 'General Purpose (Serverless)' },
      { name: 'Auto-Pause Delay', description: 'Inactivity duration before serverless database pauses', defaultValue: '1 hour' },
      { name: 'Min / Max vCore', description: 'Compute limits for serverless scaling range', defaultValue: '0.5 min to 4.0 max vCore' },
      { name: 'Backup Storage Redundancy', description: 'Redundancy type for automated backup retention', defaultValue: 'Geo-Redundant (GRS)' }
    ],
    equivalentServiceId: 'aws-rds',
    useCases: [
      'Enterprise Microsoft SQL Server Workloads',
      'SaaS Multitenant Application Backends',
      'Dynamic Serverless Web Apps',
      'Mission-Critical Financial Data Processing'
    ],
    limitations: [
      'Cross-database queries limited compared to SQL Server On-Premises (requires Elastic Queries)',
      'Specific to SQL Server engine (Azure DB for PostgreSQL/MySQL are separate PaaS services)'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview'
  },
  {
    id: 'aws-rds',
    platform: 'aws',
    serviceName: 'Amazon Relational Database Service (RDS)',
    category: 'Database',
    description: `Managed relational database service offering choice of 6 engines (Aurora, PostgreSQL, MySQL, MariaDB, Oracle, SQL Server) with automated patching, backups, and Multi-AZ replication.

### Key Concepts
- **DB Instance**: Isolated database environment running chosen database engine.
- **Multi-AZ Deployment**: Synchronous physical standby replica in secondary Availability Zone.
- **Read Replicas**: Asynchronous read-only instances for scaling read traffic.`,
    keyFeatures: [
      'Amazon Aurora option (up to 5x MySQL & 3x PostgreSQL performance)',
      'Multi-AZ synchronous replication with automatic failover (<60s)',
      'Automated snapshots with point-in-time recovery to any second',
      'RDS Proxy for serverless connection pooling',
      'RDS Storage Auto-Scaling up to 64 TB'
    ],
    pricingModel: 'Pay per DB instance-hour + provisioned storage (gp3/io2) + backup storage + data transfer out.',
    configOptions: [
      { name: 'Engine Version', description: 'Selected database engine and version specification', defaultValue: 'PostgreSQL 16.2-R1' },
      { name: 'DB Instance Class', description: 'Compute size and memory tier', defaultValue: 'db.m6g.xlarge (4 vCPU, 16 GB)' },
      { name: 'Deployment Option', description: 'Single-AZ vs Multi-AZ standby deployment', defaultValue: 'Multi-AZ DB Instance' },
      { name: 'Storage Type', description: 'EBS storage class and IOPS configuration', defaultValue: 'gp3 (3000 IOPS, 125 MB/s)' },
      { name: 'Automated Backup Retention', description: 'Number of days automated snapshots are preserved', defaultValue: '7 days (max 35)' }
    ],
    equivalentServiceId: 'azure-sql-db',
    useCases: [
      'Multi-Engine Relational Applications',
      'High Availability Enterprise Applications',
      'PostgreSQL/MySQL Cloud Migrations',
      'Serverless App Backends via RDS Proxy'
    ],
    limitations: [
      'Maintenance windows may introduce minor disruption during engine updates',
      'Aurora engine incurs different pricing mechanics compared to standard RDS'
    ],
    documentationLink: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html'
  },

  // Pair 5: Globally Distributed NoSQL
  {
    id: 'azure-cosmos-db',
    platform: 'azure',
    serviceName: 'Azure Cosmos DB',
    category: 'Database',
    description: `Fully managed, multi-model NoSQL database service offering single-digit millisecond response times, global distribution, and SLAs for throughput, consistency, latency, and availability.

### Key Concepts
- **Multi-Model APIs**: NoSQL (SQL), MongoDB, Cassandra, Gremlin (Graph), Table.
- **5 Consistency Levels**: Strong, Bounded Staleness, Session, Consistent Prefix, Eventual.
- **Request Units (RU/s)**: Normalized unit of compute, memory, and IO performance.`,
    keyFeatures: [
      'Multi-region active-active write capabilities',
      '5 well-defined consistency models with turnkey configuration',
      'Serverless (pay-per-request) or Provisioned Throughput mode',
      'Free tier available (1,000 RU/s + 25 GB storage free forever)',
      'Analytical Store with Azure Synapse Link (HTAP)'
    ],
    pricingModel: 'Provisioned throughput (RU/s per hour) + storage GB/month, OR Serverless mode (pay per million RU consumed + storage).',
    configOptions: [
      { name: 'API Choice', description: 'Database interface and query protocol', defaultValue: 'NoSQL (Core SQL API)' },
      { name: 'Capacity Mode', description: 'Provisioned RU/s vs Serverless pay-per-request', defaultValue: 'Provisioned (Autoscale)' },
      { name: 'Default Consistency Level', description: 'Consistency guarantee trade-off between speed & accuracy', defaultValue: 'Session Consistency' },
      { name: 'Global Distribution', description: 'Multi-region replication configuration', defaultValue: 'Single Region (Add multi-write as needed)' },
      { name: 'Indexing Policy', description: 'Automatic indexing behavior on all properties', defaultValue: 'Automatic (All paths indexed)' }
    ],
    equivalentServiceId: 'aws-dynamodb',
    useCases: [
      'Global E-Commerce & Retail Applications',
      'Real-time IoT Telemetry Ingestion',
      'Gaming Leaderboards & User Profiles',
      'Personalization & Recommendation Engines'
    ],
    limitations: [
      'Request Unit (RU/s) estimation can require tuning for complex query patterns',
      'Partition Key choice is permanent and cannot be altered after container creation'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/cosmos-db/'
  },
  {
    id: 'aws-dynamodb',
    platform: 'aws',
    serviceName: 'Amazon DynamoDB',
    category: 'Database',
    description: `Fully managed, serverless key-value and document NoSQL database designed for single-digit millisecond performance at any scale.

### Key Concepts
- **Partition Key & Sort Key**: Primary key schema defining item layout across partitions.
- **Global Secondary Indexes (GSI)**: Secondary access patterns querying non-key attributes.
- **Read/Write Capacity Units (RCU / WCU)**: Throughput measurement unit.`,
    keyFeatures: [
      'DynamoDB Global Tables for multi-region active-active replication',
      'DynamoDB Accelerator (DAX) in-memory cache for microsecond response',
      'On-Demand capacity mode (zero planning, auto-scaling throughput)',
      'DynamoDB Streams for real-time change data capture (CDC)',
      'ACID Transactions across multiple items and tables'
    ],
    pricingModel: 'On-Demand mode (pay per million read/write units) OR Provisioned WCU/RCU capacity + storage per GB/month.',
    configOptions: [
      { name: 'Read/Write Capacity Mode', description: 'On-Demand (auto-scaling) vs Provisioned capacity', defaultValue: 'On-Demand Mode' },
      { name: 'Table Class', description: 'Standard vs Standard-Infrequent Access (Standard-IA for 60% lower storage)', defaultValue: 'DynamoDB Standard' },
      { name: 'Point-In-Time Recovery (PITR)', description: 'Continuous backup allowing recovery to any second in past 35 days', defaultValue: 'Enabled' },
      { name: 'Global Secondary Indexes', description: 'Additional queryable key definitions', defaultValue: '0 (Configurable up to 20)' },
      { name: 'Encryption at Rest', description: 'KMS Key type used for encrypting table data', defaultValue: 'AWS Owned Key (Default)' }
    ],
    equivalentServiceId: 'azure-cosmos-db',
    useCases: [
      'High-Scale Web Application User Sessions',
      'Mobile App Backends & Shopping Carts',
      'Ad-Tech Clickstream Processing',
      'Serverless Microservice Event Stores'
    ],
    limitations: [
      'Maximum single item size limit is 400 KB',
      'Queries limited to items matching Primary Key or GSI attributes (no arbitrary SQL filters without Scan)'
    ],
    documentationLink: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html'
  },

  // Pair 6: Managed Kubernetes
  {
    id: 'azure-aks',
    platform: 'azure',
    serviceName: 'Azure Kubernetes Service (AKS)',
    category: 'Containers',
    description: `Managed Kubernetes service that simplifies deploying, managing, and operating containerized applications with automated control plane management and integrated dev tools.

### Key Concepts
- **Control Plane**: Free managed Kubernetes master nodes maintained by Azure.
- **Node Pools**: Groups of Azure VMs with identical configuration running container workloads.
- **Azure CNI vs Kubenet**: Networking plugin options for Pod IP assignment.`,
    keyFeatures: [
      'Free control plane with optional Uptime SLA (99.95%)',
      'KEDA (Kubernetes Event-driven Autoscaling) native add-on',
      'Azure AD / Entra ID integrated RBAC authentication',
      'Automated cluster upgrades & node image auto-repair',
      'Integration with Azure Container Registry (ACR) & GitHub Actions'
    ],
    pricingModel: 'Control plane is free by default (Standard tier adds $0.10/hr per cluster for 99.95% SLA). Pay only for worker node VMs and attached storage.',
    configOptions: [
      { name: 'Kubernetes Version', description: 'Upstream Kubernetes cluster release version', defaultValue: '1.29.x (Latest Stable)' },
      { name: 'Network Plugin', description: 'Pod networking model (Azure CNI Overlay vs Kubenet)', defaultValue: 'Azure CNI Overlay' },
      { name: 'Cluster Tier', description: 'Free vs Standard (Uptime SLA) cluster management tier', defaultValue: 'Free Tier' },
      { name: 'Node Pool OS', description: 'Operating system image for container node instances', defaultValue: 'Ubuntu Linux (or Azure Linux)' },
      { name: 'Auto-scaler', description: 'Cluster Autoscaler min/max node limit range', defaultValue: 'Enabled (Min: 2, Max: 10)' }
    ],
    equivalentServiceId: 'aws-eks',
    useCases: [
      'Microservice Application Architectures',
      'Hybrid Cloud Container Orchestration (via Azure Arc)',
      'CI/CD Pipeline Execution Runners',
      'AI Model Inference Workloads'
    ],
    limitations: [
      'IP address exhaustion can occur with standard Azure CNI if subnet is undersized',
      'Upgrades require careful node pool maintenance strategy'
    ],
    documentationLink: 'https://learn.microsoft.com/en-us/azure/aks/'
  },
  {
    id: 'aws-eks',
    platform: 'aws',
    serviceName: 'Amazon Elastic Kubernetes Service (EKS)',
    category: 'Containers',
    description: `Managed Kubernetes service running upstream Kubernetes with certified conformance across multiple availability zones for high availability.

### Key Concepts
- **EKS Cluster Control Plane**: Managed master nodes spread across 3 AZs ($0.10/hr).
- **Node Types**: Managed Node Groups (EC2), Fargate (Serverless pods), Self-Managed Nodes.
- **VPC CNI**: AWS native container network interface assigning real VPC IPs to Pods.`,
    keyFeatures: [
      'EKS Fargate serverless pod execution (no node management)',
      'EKS Anywhere for running EKS on-premises on bare metal or VMware',
      'Native IAM Roles for Service Accounts (IRSA) pod-level security',
      'EKS Add-ons managed lifecycle management (VPC CNI, CoreDNS, kube-proxy)',
      'Auto-mode for simplified cluster management'
    ],
    pricingModel: '$0.10 per hour per EKS cluster control plane (~$72/month) + underlying EC2 node instances / Fargate pod CPU & RAM.',
    configOptions: [
      { name: 'Kubernetes Version', description: 'Target Kubernetes release version', defaultValue: '1.29' },
      { name: 'Compute Type', description: 'Managed Node Groups (EC2) vs AWS Fargate (Serverless)', defaultValue: 'Managed Node Groups' },
      { name: 'Authentication Mode', description: 'IAM Access Entries vs ConfigMap (aws-auth)', defaultValue: 'API & ConfigMap' },
      { name: 'Subnet Placement', description: 'Private vs Public VPC subnets for worker nodes', defaultValue: 'Private Subnets' },
      { name: 'Cluster Endpoint Access', description: 'API server public vs private network reachability', defaultValue: 'Public & Private' }
    ],
    equivalentServiceId: 'azure-aks',
    useCases: [
      'Large Scale Microservice Deployments',
      'Multi-Cloud & On-Premises Consistent K8s Workloads',
      'High-Density Container Environments',
      'Financial & Compliance Sensitive Workloads'
    ],
    limitations: [
      'Always charges $0.10/hour for the control plane (no completely free tier control plane like default AKS)',
      'Requires separate ALB Ingress Controller installation compared to built-in ingress options'
    ],
    documentationLink: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html'
  }
];

export const INITIAL_PAIRS: ComparisonPair[] = [
  {
    id: 'pair-blob-s3',
    azureServiceId: 'azure-blob-storage',
    awsServiceId: 'aws-s3',
    category: 'Storage',
    summaryOfDifferences: 'Both are premier cloud object stores with 99.999999999% durability. Azure Blob Storage excels in native Data Lake integration (ADLS Gen2 hierarchical namespace) and seamless Azure ecosystem integration. AWS S3 provides more granular storage classes (Intelligent-Tiering with auto-cost optimization) and broader 3rd-party ecosystem adoption.',
    keyVerdict: 'Choose AWS S3 for universal tooling support & automatic tiering cost savings; choose Azure Blob Storage if building Azure Data Lake analytics or using Azure ADLS Gen2.',
    featured: true
  },
  {
    id: 'pair-functions-lambda',
    azureServiceId: 'azure-functions',
    awsServiceId: 'aws-lambda',
    category: 'Compute',
    summaryOfDifferences: 'AWS Lambda pioneered serverless compute with lower cold start latency and up to 15-minute execution timeouts. Azure Functions offers superior stateful orchestration via Durable Functions and declarative input/output bindings that reduce boilerplate code.',
    keyVerdict: 'AWS Lambda is ideal for event-driven microservices and AWS-native architectures. Azure Functions shines for complex multi-step workflows (Durable Functions) and enterprise C# / .NET workloads.',
    featured: true
  },
  {
    id: 'pair-vm-ec2',
    azureServiceId: 'azure-vm',
    awsServiceId: 'aws-ec2',
    category: 'Compute',
    summaryOfDifferences: 'AWS EC2 offers custom ARM-based Graviton CPUs delivering industry-leading price/performance, plus a larger range of niche instance types. Azure VMs stand out with Azure Hybrid Benefit (reusing existing Windows/SQL licenses for major savings) and tight Azure Active Directory identity integration.',
    keyVerdict: 'Use EC2 with Graviton instances for best cost efficiency on Linux; use Azure VM if migrating legacy Windows Server workloads with existing enterprise licensing.',
    featured: true
  },
  {
    id: 'pair-sql-rds',
    azureServiceId: 'azure-sql-db',
    awsServiceId: 'aws-rds',
    category: 'Database',
    summaryOfDifferences: 'Azure SQL Database is a true PaaS SQL Server engine with built-in AI auto-tuning, Hyperscale tiering (100 TB), and serverless auto-pause. AWS RDS provides flexibility across 6 database engines (including high-performance Amazon Aurora), making it versatile for multi-engine fleets.',
    keyVerdict: 'Azure SQL DB is the definitive choice for Microsoft SQL Server workloads; AWS RDS (especially Aurora) offers unmatched flexibility across PostgreSQL, MySQL, and custom database engines.',
    featured: true
  },
  {
    id: 'pair-cosmos-dynamo',
    azureServiceId: 'azure-cosmos-db',
    awsServiceId: 'aws-dynamodb',
    category: 'Database',
    summaryOfDifferences: 'Azure Cosmos DB features multi-model APIs (SQL, MongoDB, Cassandra, Gremlin) and 5 turnkey consistency levels with multi-region active-active writes. AWS DynamoDB is tightly integrated with AWS serverless (Lambda, EventBridge), supporting single-digit millisecond latency at massive scale with simple partition/sort keys.',
    keyVerdict: 'Cosmos DB is superior when multi-api compatibility (e.g. Mongo/Cassandra) or fine-tuned consistency SLAs are needed. DynamoDB is unmatched for low-friction AWS serverless architectures.',
    featured: true
  },
  {
    id: 'pair-aks-eks',
    azureServiceId: 'azure-aks',
    awsServiceId: 'aws-eks',
    category: 'Containers',
    summaryOfDifferences: 'AKS provides a free control plane, built-in KEDA autoscaling, and straightforward Azure CNI networking. AWS EKS charges $0.10/hr for the control plane but offers deep IAM pod-level integration (IRSA) and serverless Kubernetes pod execution via AWS Fargate.',
    keyVerdict: 'AKS is cost-effective and easier to configure out of the box; EKS is the enterprise benchmark for high-security, IAM-granular Kubernetes clusters in AWS.',
    featured: false
  }
];
