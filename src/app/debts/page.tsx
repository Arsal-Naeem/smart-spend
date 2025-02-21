import DebtGrid from "@/components/DebtGrid/DebtGrid";
import MainLayout from "@/components/MainLayout/MainLayout";

export default function Categories() {
  return (
    <MainLayout>
      <div
        style={{
          padding: "16px",
          color: "var(--color-accent)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Debts</h2>
      </div>
      <DebtGrid />
    </MainLayout>
  );
}
