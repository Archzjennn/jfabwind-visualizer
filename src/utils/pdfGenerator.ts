/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useStore } from '../store/useStore';

// Konstanta Warna Tema Clean
const COLOR_VIOLET = '#7c3aed';
const COLOR_DARK = '#1e1b4b';
const COLOR_SLATE = '#64748b';
const RGB_VIOLET: [number, number, number] = [124, 58, 237];

// Kamus Multi-bahasa Lokal untuk Dokumen PDF
const pdfLabels = {
  id: {
    reportTitle: "Laporan Analisis Automata",
    reportSubTitle: "Regex to NFA/DFA Visualization Report",
    printedOn: "Dicetak pada",
    regexInput: "Regex Input:",
    statsTitle: "Statistik Komputasi",
    statsSubTitle: "Ringkasan komponen penyusun struktur graf automata.",
    lblNfaStates: "Jumlah State NFA",
    lblDfaStates: "Jumlah State DFA",
    lblAlphabets: "Jumlah Alfabet",
    lblNfaTransitions: "Jumlah Transisi NFA",
    lblDfaTransitions: "Jumlah Transisi DFA",
    tableSubTitle: "Matriks perpindahan antar state berdasarkan input.",
    nfaTitle: "Non-Deterministic Finite Automata (NFA)",
    dfaTitle: "Deterministic Finite Automata (DFA)",
    nfaTableTitle: "Tabel Transisi NFA",
    dfaTableTitle: "Tabel Transisi DFA",
    nfaSub: "Hasil Thompson's Construction",
    dfaSub: "Hasil Subset Construction",
    infoStr: (start: string, accept: string) => `State Awal: ${start}  |  State Akhir: ${accept}`,
    footerApp: "JFABWIND : Aplikasi Visualisasi Automata",
    footerPage: (i: number, total: number) => `Halaman ${i} dari ${total}`,
    fileName: "Laporan-Regex"
  },
  en: {
    reportTitle: "Automata Analysis Report",
    reportSubTitle: "Regex to NFA/DFA Visualization Report",
    printedOn: "Printed on",
    regexInput: "Regex Input:",
    statsTitle: "Computational Statistics",
    statsSubTitle: "Summary of components building the automata graph structure.",
    lblNfaStates: "NFA State Count",
    lblDfaStates: "DFA State Count",
    lblAlphabets: "Alphabet Count",
    lblNfaTransitions: "NFA Transition Count",
    lblDfaTransitions: "DFA Transition Count",
    tableSubTitle: "State transition matrix based on inputs.",
    nfaTitle: "Non-Deterministic Finite Automata (NFA)",
    dfaTitle: "Deterministic Finite Automata (DFA)",
    nfaTableTitle: "NFA Transition Table",
    dfaTableTitle: "DFA Transition Table",
    nfaSub: "Thompson's Construction Result",
    dfaSub: "Subset Construction Result",
    infoStr: (start: string, accept: string) => `Initial State: ${start}  |  Final State(s): ${accept}`,
    footerApp: "JFABWIND : Automata Visualization Application",
    footerPage: (i: number, total: number) => `Page ${i} of ${total}`,
    fileName: "Regex-Report"
  }
};

export const generatePDFReport = async (nfaImage: string, dfaImage: string): Promise<void> => {
  // Ambil state 'lang' dari store aplikasi
  const { regex, nfa, dfa, history, lang } = useStore.getState();
  if (!nfa || !dfa) throw new Error("Visualisasi automata belum tersedia.");

  // Tentukan kamus bahasa aktif berdasarkan pilihan user
  const currentLang = (lang === 'en' || lang === 'id') ? lang : 'id';
  const t = pdfLabels[currentLang];

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawPageBorder = () => {
    doc.setDrawColor(COLOR_VIOLET);
    doc.setLineWidth(1.5);
    doc.line(0, 0, pageWidth, 0); 
    doc.line(0, pageHeight, pageWidth, pageHeight); 
  };

  drawPageBorder();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(COLOR_DARK);
  doc.text(t.reportTitle, 20, 35);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(COLOR_SLATE);
  doc.text(t.reportSubTitle, 20, 43);

  // Format tanggal sesuai regional bahasa terpilih
  const rawDate = history.length > 0 ? new Date(history[0].timestamp) : new Date();
  const localeStr = currentLang === 'id' ? 'id-ID' : 'en-US';
  const dateFormatted = rawDate.toLocaleDateString(localeStr, { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(10);
  doc.text(`${t.printedOn}: ${dateFormatted}`, 20, 52);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.setFillColor(252, 252, 255);
  doc.rect(20, 60, pageWidth - 40, 16, 'FD'); 
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLOR_DARK);
  doc.setFontSize(11);
  doc.text(t.regexInput, 24, 69.5);
  
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_VIOLET);
  const safeRegexString = doc.splitTextToSize(regex || "ε", pageWidth - 80);
  doc.text(safeRegexString, 52, 70);

  const drawSectionTitle = (title: string, subTitle: string, yPos: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(COLOR_DARK);
    doc.text(title, 20, yPos);
    
    doc.setDrawColor(COLOR_VIOLET);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_SLATE);
    doc.text(subTitle, 20, yPos + 8);
    
    return yPos + 18; 
  };

  let currentY = 90;
  currentY = drawSectionTitle(t.statsTitle, t.statsSubTitle, currentY);

  const stats = [
    { label: t.lblNfaStates, value: nfa.states.length.toString() },
    { label: t.lblDfaStates, value: dfa.states.length.toString() },
    { label: t.lblAlphabets, value: Array.from(new Set(nfa.transitions.map(t => t.symbol).filter(s => s !== 'ε'))).length.toString() },
    { label: t.lblNfaTransitions, value: nfa.transitions.length.toString() },
    { label: t.lblDfaTransitions, value: dfa.transitions.length.toString() },
  ];

  const colWidth = (pageWidth - 46) / 2;
  const boxHeight = 22;
  let cursorX = 20;
  let cursorY = currentY;

  stats.forEach((stat, idx) => {
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.rect(cursorX, cursorY, colWidth, boxHeight, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(COLOR_DARK);
    doc.text(stat.value, cursorX + (colWidth / 2), cursorY + 11, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(COLOR_SLATE);
    doc.text(stat.label, cursorX + (colWidth / 2), cursorY + 17, { align: 'center' });

    if (idx % 2 !== 0) {
      cursorX = 20;
      cursorY += boxHeight + 6;
    } else {
      cursorX += colWidth + 6;
    }
  });

  const printImage = (imgData: string, title: string, subTitle: string, info: string) => {
    doc.addPage();
    drawPageBorder();
    let y = 20;
    y = drawSectionTitle(title, subTitle, y);

    const imgProps = doc.getImageProperties(imgData);
    const maxImgWidth = pageWidth * 0.8; 
    
    let pdfWidth = pageWidth - 40;
    if (pdfWidth > maxImgWidth) pdfWidth = maxImgWidth;
    
    let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    if (pdfHeight > (pageHeight - y - 30)) {
        pdfHeight = pageHeight - y - 30;
        pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
    }

    const xPos = (pageWidth - pdfWidth) / 2;

    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(20, 20, 25); 
    doc.rect(xPos, y, pdfWidth, pdfHeight, 'FD'); 
    doc.addImage(imgData, 'PNG', xPos, y, pdfWidth, pdfHeight);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_DARK);
    doc.text(info, pageWidth / 2, y + pdfHeight + 10, { align: 'center' });
  };

  const printTransitionTable = (automaton: any, title: string, isNFA: boolean) => {
    doc.addPage();
    drawPageBorder();
    drawSectionTitle(title, t.tableSubTitle, 20);

    const symbols = Array.from(new Set(automaton.transitions.map((t: any) => t.symbol))).sort((a: any, b: any) => {
      if (a === 'ε') return 1; if (b === 'ε') return -1; return a.localeCompare(b);
    });

    const head = [['State', ...(isNFA ? ['ε'] : []), ...symbols.filter(s => s !== 'ε').map(s => `${s}`)]];

    const body = automaton.states.map((state: string) => {
      const isStart = state === automaton.startState;
      const isAccept = automaton.acceptStates.includes(state);
      const prefix = (isStart && isAccept) ? '→ * ' : isStart ? '→ ' : isAccept ? '* ' : '';
      const row = [`${prefix}${state}`];

      if (isNFA) {
        const eT = automaton.transitions.filter((t:any) => t.from === state && t.symbol === 'ε').map((t:any)=>t.to);
        row.push(eT.length ? `{${eT.join(',')}}` : '∅');
      }

      symbols.filter(s => s !== 'ε').forEach((sym: any) => {
        const targets = automaton.transitions.filter((t: any) => t.from === state && t.symbol === sym).map((t: any) => t.to);
        if (targets.length === 0) row.push('∅');
        else if (targets.length === 1) row.push(targets[0]);
        else row.push(`{${targets.join(',')}}`);
      });
      return row;
    });

    autoTable(doc, {
      startY: 45,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [237, 233, 254], textColor: RGB_VIOLET }, 
      styles: { font: 'courier', fontSize: 10, textColor: [30, 27, 75], lineColor: [226, 232, 240], lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [248, 250, 252] }, 
      margin: { left: 20, right: 20 },
      showHead: 'firstPage',
    });
  };

  // Cetak NFA dengan teks dinamis
  printImage(
      nfaImage, 
      t.nfaTitle, 
      t.nfaSub, 
      t.infoStr(nfa.startState, nfa.acceptStates.join(', '))
  );
  printTransitionTable(nfa, t.nfaTableTitle, true);

  // Cetak DFA dengan teks dinamis
  printImage(
      dfaImage, 
      t.dfaTitle, 
      t.dfaSub, 
      t.infoStr(dfa.startState, dfa.acceptStates.length ? dfa.acceptStates.join(', ') : '-')
  );
  printTransitionTable(dfa, t.dfaTableTitle, false);

  // Penomoran Halaman Dinamis
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore : Akses internal num halaman
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 12, pageWidth - 20, pageHeight - 12);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    
    doc.text(t.footerApp, 20, pageHeight - 7);
    doc.text(t.footerPage(i, totalPages), pageWidth - 20, pageHeight - 7, { align: 'right' });
  }

  const safeName = regex ? regex.replace(/[^a-zA-Z0-9]/g, '_') : 'Automata';
  doc.save(`${t.fileName}-${safeName}.pdf`);
};