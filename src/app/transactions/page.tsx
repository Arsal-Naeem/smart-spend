import MainLayout from "@/components/MainLayout/MainLayout";
import TransactionsTable from "@/components/TransactionTable/TransactionTable";

export default function Transactions() {
  return (
    <>
      <div>
        <MainLayout>
          <TransactionsTable />
        </MainLayout>
      </div>
    </>
  );
}
