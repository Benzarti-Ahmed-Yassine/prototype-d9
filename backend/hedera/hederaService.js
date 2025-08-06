const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TopicInfoQuery
} = require("@hashgraph/sdk");

require('dotenv').config();

class HederaService {
    constructor() {
        this.client = null;
        this.operatorId = process.env.HEDERA_OPERATOR_ID;
        this.operatorKey = process.env.HEDERA_OPERATOR_KEY;
        this.auditTopicId = process.env.AUDIT_TOPIC_ID;
        this.init();
    }

    async init() {
        try {
            if (!this.operatorId || !this.operatorKey) {
                console.warn("Hedera credentials not found, using mock mode");
                return;
            }

            this.client = Client.forTestnet();
            this.client.setOperator(this.operatorId, this.operatorKey);
            console.log("✅ Hedera client initialized successfully");
        } catch (error) {
            console.error("❌ Failed to initialize Hedera client:", error.message);
        }
    }

    async createAccount() {
        try {
            if (!this.client) {
                return this.mockCreateAccount();
            }

            const newAccountPrivateKey = PrivateKey.generateED25519();
            const newAccountPublicKey = newAccountPrivateKey.publicKey;

            const newAccount = await new AccountCreateTransaction()
                .setKey(newAccountPublicKey)
                .setInitialBalance(Hbar.fromTinybars(1000))
                .execute(this.client);

            const getReceipt = await newAccount.getReceipt(this.client);
            const newAccountId = getReceipt.accountId;

            return {
                accountId: newAccountId.toString(),
                privateKey: newAccountPrivateKey.toString(),
                publicKey: newAccountPublicKey.toString()
            };
        } catch (error) {
            console.error("Error creating Hedera account:", error);
            return this.mockCreateAccount();
        }
    }

    mockCreateAccount() {
        const mockAccountId = `0.0.${Math.floor(Math.random() * 1000000)}`;
        const mockPrivateKey = `302e020100300506032b657004220420${Math.random().toString(16).substring(2, 66)}`;
        const mockPublicKey = `302a300506032b6570032100${Math.random().toString(16).substring(2, 66)}`;
        
        return {
            accountId: mockAccountId,
            privateKey: mockPrivateKey,
            publicKey: mockPublicKey
        };
    }

    async submitAuditLog(action, userId, data) {
        try {
            const auditData = {
                timestamp: new Date().toISOString(),
                action,
                userId,
                data,
                hash: this.generateHash(JSON.stringify({ action, userId, data }))
            };

            if (!this.client || !this.auditTopicId) {
                console.log("📝 Mock Audit Log:", auditData);
                return { success: true, transactionId: `mock-${Date.now()}` };
            }

            const submitTx = await new TopicMessageSubmitTransaction()
                .setTopicId(this.auditTopicId)
                .setMessage(JSON.stringify(auditData))
                .execute(this.client);

            const receipt = await submitTx.getReceipt(this.client);
            
            return {
                success: true,
                transactionId: submitTx.transactionId.toString(),
                sequenceNumber: receipt.topicSequenceNumber
            };
        } catch (error) {
            console.error("Error submitting audit log:", error);
            return { success: false, error: error.message };
        }
    }

    generateHash(data) {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    async getAccountBalance(accountId) {
        try {
            if (!this.client) {
                return { balance: "100.00", currency: "HBAR" };
            }

            const balance = await new AccountBalanceQuery()
                .setAccountId(accountId)
                .execute(this.client);

            return {
                balance: balance.hbars.toString(),
                currency: "HBAR"
            };
        } catch (error) {
            console.error("Error getting account balance:", error);
            return { balance: "0.00", currency: "HBAR" };
        }
    }
}

module.exports = new HederaService();
