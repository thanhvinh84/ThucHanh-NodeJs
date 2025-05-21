const Account = require("../models/account.model");
const crypto = require("crypto");

const createAccount = async ({ user, currency, description, balance }) => {
  const exists = await Account.findOne({ user });
  if (exists) throw new Error("Người dùng đã tồn tại");

  const acc = new Account({
    user,
    currency,
    description: description || `${user}'s budget`,
    balance: parseFloat(balance) || 0,
    transactions: [],
  });

  return acc.save();
};

const getAccount = async (user) => {
  return Account.findOne({ user });
};

const deleteAccount = async (user) => {
  return Account.deleteOne({ user });
};

const addTransaction = async (user, { date, object, amount }) => {
  const acc = await Account.findOne({ user });
  if (!acc) throw new Error("Không tìm thấy người dùng");

  const amt = parseFloat(amount);
  if (isNaN(amt)) throw new Error("Số tiền không hợp lệ");

  const id = crypto.createHash("md5").update(date + object + amt).digest("hex");

  if (acc.transactions.some((tx) => tx.id === id)) {
    throw new Error("Giao dịch đã tồn tại");
  }

  const transaction = { id, date, object, amount: amt };
  acc.transactions.push(transaction);
  acc.balance += amt;

  await acc.save();
  return transaction;
};

const deleteTransaction = async (user, id) => {
  const acc = await Account.findOne({ user });
  if (!acc) throw new Error("Không tìm thấy người dùng");

  const index = acc.transactions.findIndex((tx) => tx.id === id);
  if (index === -1) throw new Error("Không tìm thấy giao dịch");

  const [removed] = acc.transactions.splice(index, 1);
  acc.balance -= removed.amount;

  await acc.save();
};

module.exports = {
  createAccount,
  getAccount,
  deleteAccount,
  addTransaction,
  deleteTransaction,
};