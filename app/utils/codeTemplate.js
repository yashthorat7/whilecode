import { DELIMITER } from './constants';

const CPP_INPUT_HELPERS = `
template<typename T> ostream& operator<<(ostream& os, const vector<T>& v) {
    os << "[";
    for(size_t i=0; i<v.size(); ++i) { if(i) os << ", "; os << v[i]; }
    os << "]";
    return os;
}
template<typename T1, typename T2> ostream& operator<<(ostream& os, const pair<T1,T2>& p) {
    os << "(" << p.first << ", " << p.second << ")";
    return os;
}

template<typename T> void read(T& x) { cin >> x; }
void read(string& x) { cin >> x; }
template<typename T1, typename T2> void read(pair<T1, T2>& p) {
    char c;
    while(cin && isspace(cin.peek())) cin.ignore();
    if(cin.peek() == '(') {
        cin >> c;
        read(p.first);
        while(cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
        read(p.second);
        while(cin && (isspace(cin.peek()) || cin.peek() == ')')) cin.ignore();
    } else {
        read(p.first);
        read(p.second);
    }
}
template<typename T> void read(vector<T>& v) {
    while(cin && isspace(cin.peek())) cin.ignore();
    if(cin.peek() == '[') {
        char c; cin >> c;
        while(cin) {
            while(cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
            if(cin.peek() == ']') { cin.ignore(); break; }
            if(cin.peek() == EOF) break;
            T x; if(cin >> x) v.push_back(x);
            else break;
        }
    } else {
        string line;
        if(getline(cin, line)) {
            istringstream iss(line);
            T x;
            while(iss >> x) v.push_back(x);
        }
    }
}
`;


export function extractFunction(fullCode, language = 'cpp') {
  if (!fullCode) return '';
  let lines = fullCode.split('\n');
  let functionStart = -1;
  let inTemplate = false;

  const funcRegex = /^[a-zA-Z0-9_<>:,\s*&]+[ \t]+[a-zA-Z0-9_]+[ \t]*\([^{]*\)[ \t]*{/;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#include') || line.startsWith('using namespace') || (line.startsWith('//') && i < 10)) continue;
    if (line.startsWith('template<')) { inTemplate = true; continue; }
    if (inTemplate) { if (line.includes('}')) inTemplate = false; continue; }
    if (line.includes('operator<<') || line.includes('void read(')) continue;
    if (funcRegex.test(line) && !line.includes('int main')) functionStart = i;
  }

  if (functionStart === -1) return fullCode;

  let result = [];
  for (let i = functionStart; i < lines.length; i++) {
    if (lines[i].includes('int main()') || lines[i].includes('int main(')) break;
    result.push(lines[i]);
  }
  return result.join('\n').trim();
}


function generateCppWrapper(functionCode) {
  if (!functionCode) return '';
  const functionRegex = /([\w\s<>:,*&]+)\s+(\w+)\s*\(([^)]*)\)/;
  const match = functionCode.match(functionRegex);

  if (!match) return `#include <bits/stdc++.h>\nusing namespace std;\n\n${functionCode}`;

  const returnType = match[1].trim();
  const functionName = match[2];
  const argsStr = match[3];

  let wrapper = `#include <bits/stdc++.h>\nusing namespace std;\n${CPP_INPUT_HELPERS}\n${functionCode}\n\nint main() {\n    ios_base::sync_with_stdio(false); cin.tie(NULL);\n    while (cin >> ws && cin.peek() != EOF) {\n`;

  const args = argsStr.split(',').map(s => s.trim()).filter(s => s).map(s => {
    const parts = s.split(/\s+/);
    const name = parts[parts.length - 1].replace(/[*&]/g, '');
    let type = parts.slice(0, -1).join(' ');
    let cleanType = type.replace(/\bconst\b/g, '').replace(/\bvolatile\b/g, '').replace(/[&]/g, '').trim();
    return { type, cleanType, name };
  });

  args.forEach((arg, index) => {
    wrapper += `        ${arg.cleanType} ${arg.name};\n        read(${arg.name});\n`;
    if (index === 0 && arg.cleanType.includes('vector')) wrapper += `        if(${arg.name}.empty()) break;\n`;
  });

  const isVoid = returnType === 'void' || returnType.endsWith(' void');
  if (isVoid) wrapper += `        ${functionName}(${args.map(a => a.name).join(', ')});\n`;
  else wrapper += `        cout << ${functionName}(${args.map(a => a.name).join(', ')}) << endl;\n`;

  wrapper += `        cout << "${DELIMITER}" << endl;\n    }\n    return 0;\n}`;
  return wrapper;
}

export function getFullCode(userCode, language = 'cpp') {
  const funcCode = extractFunction(userCode, language);
  if (language === 'cpp') return generateCppWrapper(funcCode);
  

  if (language === 'c') {
    return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\n${userCode}`;
  }
  return userCode;
}
