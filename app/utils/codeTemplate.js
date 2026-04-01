import { DELIMITER } from './constants';

export function extractFunction(userCode) {
  const lines = userCode.split('\n');
  let firstCodeLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      firstCodeLine = i;
      break;
    }
  }

  const codeAfterPreamble = lines.slice(firstCodeLine).join('\n');
  const functionRegex = /([\w<>,:\s&*]+)\s+(\w+)\s*\(([\s\S]*?)\)\s*\{/g;
  let match;
  let lastMatch = null;

  while ((match = functionRegex.exec(codeAfterPreamble)) !== null) {
    lastMatch = match;
  }

  if (!lastMatch) return null;

  const [_, returnType, name, argsStr] = lastMatch;
  const args = argsStr.split(',').filter(a => a.trim()).map(arg => {
    const parts = arg.trim().split(/\s+/);
    const name = parts.pop().replace(/[&*]/g, '');
    const type = parts.join(' ').replace(/\s*const\s*/g, '').trim();
    const isRef = arg.includes('&');
    return { type, name, isRef };
  });

  return { returnType: returnType.trim(), name: name.trim(), args };
}

export function getFullCode(userCode, language) {
  const sig = extractFunction(userCode);
  if (!sig) return userCode;

  if (language === 'cpp') {
    return `
#include <bits/stdc++.h>
using namespace std;

template<typename T>
ostream& operator<<(ostream& os, const vector<T>& v) {
  os << "[";
  for (size_t i = 0; i < v.size(); ++i) {
    if (i) os << ", ";
    os << v[i];
  }
  return os << "]";
}

template<typename T1, typename T2>
ostream& operator<<(ostream& os, const pair<T1, T2>& p) {
  return os << "(" << p.first << ", " << p.second << ")";
}

template<typename T> void read(T& x) { cin >> x; }
void read(string& x) { cin >> x; }
template<typename T> void read(vector<T>& v) {
  int n; cin >> n;
  v.resize(n);
  for (int i = 0; i < n; i++) read(v[i]);
}
template<typename T1, typename T2> void read(pair<T1, T2>& p) {
  read(p.first); read(p.second);
}

${userCode}

int main() {
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);
  while (cin >> ws && cin.peek() != EOF) {
    ${sig.args.map(arg => `${arg.type} ${arg.name}; read(${arg.name});`).join('\n    ')}
    ${sig.returnType === 'void' ? `${sig.name}(${sig.args.map(a => a.name).join(', ')});` : `auto result = ${sig.name}(${sig.args.map(a => a.name).join(', ')}); cout << result << endl;`}
    cout << "${DELIMITER}" << endl;
  }
  return 0;
}
    `.trim();
  }

  if (language === 'c') {
    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

int main() {
  ${sig.args.map(arg => `${arg.type} ${arg.name};`).join('\n  ')}
  while (1) {
    int res = 0;
    ${sig.args.map((arg, i) => {
      let format = '';
      if (arg.type === 'int') format = '%d';
      else if (arg.type === 'long long') format = '%lld';
      else if (arg.type === 'float') format = '%f';
      else if (arg.type === 'double') format = '%lf';
      else if (arg.type === 'char') format = ' %c';
      else if (arg.type === 'char*' || arg.type.includes('[')) format = '%s';
      return `res += scanf("${format}", &${arg.name});`;
    }).join('\n    ')}
    if (res < ${sig.args.length}) break;
    ${sig.returnType === 'void' ? `${sig.name}(${sig.args.map(a => a.name).join(', ')});` : `${sig.returnType} result = ${sig.name}(${sig.args.map(a => a.name).join(', ')});`}
    ${sig.returnType !== 'void' ? `
      if (strcmp("${sig.returnType}", "int") == 0) printf("%d\\n", result);
      else if (strcmp("${sig.returnType}", "long long") == 0) printf("%lld\\n", result);
      else if (strcmp("${sig.returnType}", "double") == 0) printf("%.6f\\n", result);
      else if (strcmp("${sig.returnType}", "float") == 0) printf("%f\\n", result);
    ` : ''}
    printf("${DELIMITER}\\n");
    fflush(stdout);
  }
  return 0;
}
    `.trim();
  }

  return userCode;
}
