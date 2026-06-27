export const preprocessRegex = (input: string): string => {
  let result = input;

  // 1. Expand Character Classes & Ranges (Contoh: [a-c] -> (a|b|c), [xyz] -> (x|y|z))
  result = result.replace(/\[(.*?)\]/g, (_, inner) => {
    const chars = new Set<string>();
    for (let i = 0; i < inner.length; i++) {
      // Jika mendeteksi range seperti a-z
      if (inner[i + 1] === '-' && i + 2 < inner.length) {
        const start = inner.charCodeAt(i);
        const end = inner.charCodeAt(i + 2);
        for (let c = start; c <= end; c++) {
          chars.add(String.fromCharCode(c));
        }
        i += 2; // Lewati tanda '-' dan karakter batas akhir
      } else {
        chars.add(inner[i]);
      }
    }
    return '(' + Array.from(chars).join('|') + ')';
  });

  // Fungsi helper untuk mencari token tepat sebelum operator (+, ?, {})
  const getPrevToken = (str: string, index: number) => {
    let i = index - 1;
    // Jika token sebelumnya adalah grup dalam kurung (...)
    if (str[i] === ')') {
      let depth = 1;
      i--;
      while (i >= 0 && depth > 0) {
        if (str[i] === ')') depth++;
        else if (str[i] === '(') depth--;
        i--;
      }
      return { token: str.substring(i + 1, index), start: i + 1 };
    }
    // Jika token sebelumnya hanya 1 karakter biasa
    return { token: str[i], start: i };
  };

  // 2. Expand Quantifiers: +, ?, {n}, {n,m} (Diproses dari kanan ke kiri agar index tidak bergeser)
  let i = result.length - 1;
  while (i >= 0) {
    if (result[i] === '+') {
      const { token, start } = getPrevToken(result, i);
      result = result.substring(0, start) + token + token + '*' + result.substring(i + 1);
      i = start - 1;
    } else if (result[i] === '?') {
      const { token, start } = getPrevToken(result, i);
      // Menggunakan ε (epsilon) untuk mewakili zero/kosong
      result = result.substring(0, start) + '(' + token + '|ε)' + result.substring(i + 1);
      i = start - 1;
    } else if (result[i] === '}') {
      const openBrace = result.lastIndexOf('{', i);
      if (openBrace !== -1) {
        const { token, start } = getPrevToken(result, openBrace);
        const content = result.substring(openBrace + 1, i);
        const parts = content.split(',');
        
        // eslint-disable-next-line no-useless-assignment
        let expanded = '';
        const n = parseInt(parts[0], 10);
        
        if (parts.length === 1) {
          // Kasus {n} -> Expand token sebanyak n kali
          expanded = token.repeat(n);
        } else {
          // Kasus {n,m} -> Expand kombinasi dari n sampai m kali dengan OR (|)
          const m = parts[1] ? parseInt(parts[1], 10) : n;
          const options = [];
          for (let k = n; k <= m; k++) {
            options.push(k === 0 ? 'ε' : token.repeat(k));
          }
          expanded = '(' + options.join('|') + ')';
        }
        
        result = result.substring(0, start) + expanded + result.substring(i + 1);
        i = start - 1;
      } else {
        i--;
      }
    } else {
      i--;
    }
  }

  return result;
};