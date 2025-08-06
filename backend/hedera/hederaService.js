const { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } = require("@hashgraph/sdk");

class HederaService {
    constructor() {
        this.client = null;
        this.operatorId = process.env.HEDERA_OPERATOR_ID;
        this.operatorKey = process.env.HEDERA_OPERATOR_KEY;
        this.auditTopicId = process.env.AUDIT_TOPIC_ID;
        this.initialized = false;
    }

    async initialize() {
        try {
            if (!this.operatorId || !this.operatorKey) {
                console.warn("⚠️ Hedera credentials not found, running in demo mode");
                this.initialized = false;
                return;
            }

            this.client = Client.forTestnet();
            this.client.setOperator(this.operatorId, PrivateKey.fromString(this.operatorKey));
            
            console.log("✅ Hedera client initialized successfully");
            this.initialized = true;
        } catch (error) {
            console.error("❌ Failed to initialize Hedera client:", error.message);
            this.initialized = false;
        }
    }

    async createAuditTopic() {
        if (!this.initialized) {
            console.log("📝 Demo mode: Audit topic creation simulated");
            return "0.0.demo";
        }

        try {
            const transaction = new TopicCreateTransaction()
                .setTopicMemo("MediFlow Audit Trail");
            
            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);
            
            console.log("✅ Audit topic created:", receipt.topicId.toString());
            return receipt.topicId.toString();
        } catch (error) {
            console.error("❌ Failed to create audit topic:", error.message);
            throw error;
        }
    }

    async submitAuditLog(action, data) {
        if (!this.initialized) {
            console.log("📝 Demo mode: Audit log simulated -", action, JSON.stringify(data));
            return { success: true, demo: true };
        }

        try {
            const auditData = {
                timestamp: new Date().toISOString(),
                action: action,
                data: data,
                hash: this.generateHash(JSON.stringify(data))
            };

            const transaction = new TopicMessageSubmitTransaction()
                .setTopicId(TopicId.fromString(this.auditTopicId))
                .setMessage(JSON.stringify(auditData));

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            console.log("✅ Audit log submitted to Hedera:", receipt.status.toString());
            return { success: true, transactionId: response.transactionId.toString() };
        } catch (error) {
            console.error("❌ Failed to submit audit log:", error.message);
            return { success: false, error: error.message };
        }
    }

    generateHash(data) {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    async logPrescriptionCreated(prescription) {
        return await this.submitAuditLog('PRESCRIPTION_CREATED', {
            prescriptionId: prescription.id,
            doctorId: prescription.doctorId,
            patientName: prescription.patientName,
            medication: prescription.medication
        });
    }

    async logPrescriptionUpdated(prescription) {
        return await this.submitAuditLog('PRESCRIPTION_UPDATED', {
            prescriptionId: prescription.id,
            updatedBy: prescription.updatedBy,
            changes: prescription.changes
        });
    }

    async logUserLogin(user) {
        return await this.submitAuditLog('USER_LOGIN', {
            userId: user.id,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        });
    }
}

module.exports = new HederaService();
