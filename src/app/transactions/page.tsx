import TransactionModal from "@/components/TransactionModal/TransactionModal";
import TransactionsTable from "@/components/TransactionTable/TransactionTable";

export default function Transactions() {
  return (
    <>
      <div>

        <TransactionsTable />
        <TransactionModal />
      </div>
    </>
  );
}
