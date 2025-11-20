import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateBillPDF(table: any) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Bill for Table ${table.number}`, 14, 15);

  doc.setFontSize(12);
  doc.text(`Bill Number: ${table.billNumber ?? "N/A"}`, 14, 25);
  doc.text(`Waiter: ${table.assignedWaiter}`, 14, 32);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 39);

  const rows = table.orders.map((o: any) => [
    o.name,
    o.quantity,
    o.price.toFixed(2) + table.currency,
    o.total.toFixed(2) + table.currency
  ]);

  autoTable(doc, {
    head: [["Item", "Qty", "Price", "Total"]],
    body: rows,
    margin: { top: 50 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.text(`Subtotal: ${table.totalPriceWithoutTVSH.toFixed(2)}${table.currency}`, 14, finalY);
  doc.text(`TVSH: ${table.tvsh.toFixed(2)}${table.currency}`, 14, finalY + 7);
  doc.text(
    `Total: ${table.totalPriceWithTVSH.toFixed(2)}${table.currency}`,
    14,
    finalY + 14
  );

  doc.save(`bill_table_${table.number}.pdf`);
}
