const { Client, FileCreateTransaction, Hbar, PrivateKey } = require("@hashgraph/sdk");
const client = Client.forTestnet();

// Clés Hedera directement dans le code
const accountId = "0.0.6472099";
const privateKey = PrivateKey.fromString("3030020100300706052b8104000a0422042093aa81b894242776c12ca5f447ee245f80ce2e9a2a257e70a4dc90526ad9bf0b");

client.setOperator(accountId, privateKey);

exports.logPrescriptionOnChain = async (data) => {
  const tx = await new FileCreateTransaction()
    .setContents(JSON.stringify(data))
    .setMaxTransactionFee(new Hbar(2))
    .execute(client);
  const receipt = await tx.getReceipt(client);
  return receipt.fileId.toString();
};
