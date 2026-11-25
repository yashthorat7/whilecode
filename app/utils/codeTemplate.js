import { DELIMITER } from './constants';

const CPP_INPUT_HELPERS = `
template<typename T> ostream& operator<<(ostream& os, const vector<T>& v) {
    os << "[";
    for (size_t i = 0; i < v.size(); ++i) { if (i) os << ", "; os << v[i]; }
    os << "]";
    return os;
}
template<typename T1, typename T2> ostream& operator<<(ostream& os, const pair<T1,T2>& p) {
    return os << "(" << p.first << ", " << p.second << ")";
}

template<typename T> bool read(T& x, istream& in = cin);
bool read(bool& x, istream& in = cin);
bool read(char& x, istream& in = cin);
bool read(string& x, istream& in = cin);
template<typename T1, typename T2> bool read(pair<T1,T2>& p, istream& in = cin);
template<typename T> bool read(vector<T>& v, istream& in = cin);

template<typename T> bool read(T& x, istream& in) {
    while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
    return static_cast<bool>(in >> x);
}
bool read(bool& x, istream& in) {
    while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
    if (!in || in.peek() == EOF) return false;
    if (isdigit(in.peek())) {
        int v;
        if (!(in >> v)) return false;
        x = v != 0;
        return true;
    }
    return static_cast<bool>(in >> boolalpha >> x >> noboolalpha);
}
bool read(char& x, istream& in) {
    while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
    if (!in || in.peek() == EOF) return false;
    if (in.peek() == '"' || in.peek() == '\\'') {
        char q = in.get();
        if (!in.get(x)) return false;
        if (in.peek() == q) in.ignore();
        return true;
    }
    return static_cast<bool>(in >> x);
}
bool read(string& x, istream& in) {
    while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
    if (!in || in.peek() == EOF) return false;
    if (in.peek() == '"') {
        in.ignore();
        return static_cast<bool>(getline(in, x, '"'));
    }
    return static_cast<bool>(in >> x);
}
template<typename T1, typename T2> bool read(pair<T1,T2>& p, istream& in) {
    char c;
    while (in && isspace(in.peek())) in.ignore();
    if (in.peek() == '(') {
        in >> c;
        if (!read(p.first, in)) return false;
        while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
        if (!read(p.second, in)) return false;
        while (in && (isspace(in.peek()) || in.peek() == ')')) in.ignore();
        return true;
    }
    return read(p.first, in) && read(p.second, in);
}
template<typename T> bool readElem(T& x, istream& in) { return read(x, in); }
bool readElem(string& x, istream& in) {
    while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
    if (!in || in.peek() == EOF || in.peek() == ']') return false;
    if (in.peek() == '"') {
        in.ignore();
        return static_cast<bool>(getline(in, x, '"'));
    }
    x.clear();
    while (in && in.peek() != EOF && !isspace(in.peek()) && in.peek() != ',' && in.peek() != ']')
        x += in.get();
    return !x.empty();
}
template<typename T> bool read(vector<T>& v, istream& in) {
    while (in && isspace(in.peek())) in.ignore();
    if (!in || in.peek() == EOF) return false;
    if (in.peek() == '[') {
        in.ignore();
        while (in) {
            while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
            if (in.peek() == ']') { in.ignore(); return true; }
            if (in.peek() == EOF) return false;
            T x;
            if (readElem(x, in)) {
                v.push_back(x);
            } else {
                in.clear();
                string s;
                in >> s;
                if (s == "]" || s == "],") return true;
            }
        }
        return false;
    }
    string line;
    if (!getline(in, line)) return false;
    istringstream iss(line);
    T x;
    while (read(x, iss)) v.push_back(x);
    return true;
}
`;

const CPP_LEETCODE_STRUCTS = `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

bool read(ListNode*& head, istream& in = cin) {
    vector<int> v;
    if (!read(v, in)) return false;
    if (v.empty()) { head = nullptr; return true; }
    head = new ListNode(v[0]);
    ListNode* curr = head;
    for (size_t i = 1; i < v.size(); ++i) { curr->next = new ListNode(v[i]); curr = curr->next; }
    return true;
}

bool read(TreeNode*& root, istream& in = cin) {
    while (in && isspace(in.peek())) in.ignore();
    if (!in || in.peek() == EOF) return false;
    if (in.peek() == '[') {
        in.ignore();
        vector<string> v;
        while (in) {
            while (in && (isspace(in.peek()) || in.peek() == ',')) in.ignore();
            if (in.peek() == ']') { in.ignore(); break; }
            if (in.peek() == EOF) break;
            string s;
            while (in && in.peek() != ',' && in.peek() != ']' && !isspace(in.peek())) {
                s += in.get();
            }
            if (!s.empty()) v.push_back(s);
        }
        if (v.empty() || v[0] == "null") { root = nullptr; return true; }
        root = new TreeNode(stoi(v[0]));
        queue<TreeNode*> q;
        q.push(root);
        size_t i = 1;
        while (!q.empty() && i < v.size()) {
            TreeNode* curr = q.front(); q.pop();
            if (i < v.size() && v[i] != "null") {
                curr->left = new TreeNode(stoi(v[i]));
                q.push(curr->left);
            }
            i++;
            if (i < v.size() && v[i] != "null") {
                curr->right = new TreeNode(stoi(v[i]));
                q.push(curr->right);
            }
            i++;
        }
        return true;
    }
    root = nullptr;
    return true;
}

ostream& operator<<(ostream& os, ListNode* head) {
    os << "[";
    while (head) { os << head->val; if (head->next) os << ","; head = head->next; }
    os << "]"; return os;
}

ostream& operator<<(ostream& os, TreeNode* root) {
    if (!root) return os << "[]";
    os << "[";
    queue<TreeNode*> q;
    q.push(root);
    vector<string> res;
    while (!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        if (curr) {
            res.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        } else {
            res.push_back("null");
        }
    }
    while (!res.empty() && res.back() == "null") res.pop_back();
    for (size_t i = 0; i < res.size(); ++i) {
        if (i) os << ",";
        os << res[i];
    }
    os << "]";
    return os;
}
`;

function maskCommentsAndStrings(code) {
  return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, m =>
    m.startsWith('/') ? m.replace(/[^\n]/g, ' ') : '"' + ' '.repeat(Math.max(0, m.length - 2)) + '"'
  );
}

function findBraceClose(code, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function topLevelSlices(code) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') {
      if (depth === 0) out += '{';
      depth++;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      if (depth === 0) out += '}';
    } else if (depth === 0) {
      out += ch;
    }
  }
  return out;
}

function detectStructure(fullCode) {
  if (!fullCode) return { type: 'function', hasSolutionClass: false };
  const masked = topLevelSlices(maskCommentsAndStrings(fullCode));
  const classes = [...masked.matchAll(/\bclass\s+(\w+)/g)].map(m => m[1]);
  if (classes.includes('Solution')) return { type: 'function', hasSolutionClass: true };
  if (classes.length) return { type: 'class', name: classes[classes.length - 1] };
  return { type: 'function', hasSolutionClass: false };
}

function stripBoilerplate(fullCode) {
  if (!fullCode) return '';
  let code = fullCode
    .replace(/^\s*#include\b[^\n]*\n?/gm, '')
    .replace(/^\s*using\s+namespace\s+\w+\s*;\s*\n?/gm, '');

  const masked = maskCommentsAndStrings(code);
  const mainMatch = masked.match(/\bint\s+main\s*\([^)]*\)[^{]*\{/);
  if (mainMatch) {
    const openIdx = mainMatch.index + mainMatch[0].length - 1;
    const closeIdx = findBraceClose(masked, openIdx);
    if (closeIdx !== -1) {
      code = code.slice(0, mainMatch.index) + code.slice(closeIdx + 1);
    }
  }
  return code.trim();
}

function splitArgs(argsStr) {
  const res = [];
  let cur = '';
  let depth = 0;
  for (const ch of argsStr) {
    if (ch === '<') depth++;
    else if (ch === '>') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      if (cur.trim()) res.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

function parseArg(s) {
  const m = s.match(/^(.*?)\s*([*&]*)\s*(\w+)(?:\s*=\s*[^,]+)?$/);
  if (!m) return null;
  const cleanType = (m[1] + (m[2].includes('*') ? '*' : ''))
    .replace(/\bconst\b/g, '')
    .replace(/[&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { cleanType, name: m[3] };
}

function extractPublicMembers(code, className) {
  const masked = maskCommentsAndStrings(code);
  const clsMatch = masked.match(new RegExp(`\\bclass\\s+${className}\\b[^{]*\\{`));
  if (!clsMatch) return [];

  const openIdx = clsMatch.index + clsMatch[0].length - 1;
  const closeIdx = findBraceClose(masked, openIdx);
  if (closeIdx === -1) return [];

  const topBody = topLevelSlices(masked.slice(openIdx + 1, closeIdx));
  const sections = topBody.split(/\b(public|private|protected)\s*:/);
  const sigRegex = new RegExp(
    `(?:((?:[\\w<>,*&]|::|\\s)+?[\\s*&])|\\b)(${className}|\\w+)\\s*\\(([^)]*)\\)[^{;]*\\{`,
    'g'
  );
  const members = [];

  for (let i = 1; i < sections.length; i += 2) {
    if (sections[i] !== 'public') continue;
    for (const m of sections[i + 1].matchAll(sigRegex)) {
      const name = m[2];
      const returnType = (m[1] || '').trim();
      if (!returnType && name !== className) continue;
      if (name === 'main') continue;
      members.push({
        isCtor: name === className,
        returnType,
        name,
        args: splitArgs(m[3]).map(parseArg).filter(Boolean),
      });
    }
  }
  return members;
}

function extractEntrySignature(code, hasSolutionClass) {
  if (hasSolutionClass) {
    return extractPublicMembers(code, 'Solution').find(m => !m.isCtor) || null;
  }

  const top = topLevelSlices(maskCommentsAndStrings(code));
  const sigRegex = /((?:[\w<>,*&]|::|\s)+?[\s*&])(\w+)\s*\(([^)]*)\)[^{;]*\{/g;
  let last = null;
  for (const m of top.matchAll(sigRegex)) {
    const name = m[2];
    if (name !== 'main' && name !== 'read' && !m[1].includes('operator')) {
      last = { returnType: m[1].trim(), name, args: splitArgs(m[3]).map(parseArg).filter(Boolean) };
    }
  }
  return last;
}

function generateClassWrapper(classCode, className) {
  const members = extractPublicMembers(classCode, className);
  const ctors = members.filter(m => m.isCtor);
  const methods = members.filter(m => !m.isCtor);

  const ctorLines = (ctors.length ? ctors : [{ args: [] }])
    .map((c, idx) => {
      const argsCall = c.args.map((a, i) => `parseArg<${a.cleanType}>(p[${i}])`).join(', ');
      return `                ${idx ? 'else ' : ''}if (p.size() == ${c.args.length}) obj = new ${className}(${argsCall});`;
    })
    .join('\n');

  const methodLines = methods
    .map(m => {
      const argsCall = m.args.map((a, i) => `parseArg<${a.cleanType}>(p[${i}])`).join(', ');
      const isVoid = m.returnType === 'void' || m.returnType.endsWith(' void');
      const body = isVoid
        ? `obj->${m.name}(${argsCall}); cout << "null";`
        : `cout << obj->${m.name}(${argsCall});`;
      return `                else if (cmd == "${m.name}" && p.size() == ${m.args.length}) { ${body} }`;
    })
    .join('\n');

  return `
#include <bits/stdc++.h>
using namespace std;
${CPP_INPUT_HELPERS}
${CPP_LEETCODE_STRUCTS}

${classCode}

template<typename T>
T parseArg(const string& s) {
    if (s == "null") return T();
    istringstream ss(s);
    T res{};
    read(res, ss);
    return res;
}
template<>
string parseArg<string>(const string& s) {
    return s == "null" ? "" : s;
}

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL); cout << boolalpha;
    while (cin >> ws && cin.peek() != EOF) {
        vector<string> cmds;
        if (!read(cmds) || cmds.empty()) break;
        vector<vector<string>> params;
        read(params);

        ${className}* obj = nullptr;
        cout << "[";
        for (size_t i = 0; i < cmds.size(); ++i) {
            if (i) cout << ",";
            string cmd = cmds[i];
            vector<string> p = i < params.size() ? params[i] : vector<string>{};

            if (cmd == "${className}") {
${ctorLines}
                cout << "null";
            } else if (obj) {
                if (false) {}
${methodLines}
                else cout << "null";
            }
        }
        cout << "]" << endl;
        if (obj) delete obj;
        cout << "${DELIMITER}" << endl;
    }
    return 0;
}
`.trim();
}

function generateCppWrapper(userCode, hasSolutionClass = false) {
  if (!userCode) return '';
  const cleaned = stripBoilerplate(userCode);
  const sig = extractEntrySignature(cleaned, hasSolutionClass);
  if (!sig) return `#include <bits/stdc++.h>\nusing namespace std;\n\n${userCode}`;

  let wrapper = `#include <bits/stdc++.h>\nusing namespace std;\n${CPP_INPUT_HELPERS}\n${CPP_LEETCODE_STRUCTS}\n${cleaned}\n\nint main() {\n    ios_base::sync_with_stdio(false); cin.tie(NULL); cout << boolalpha;\n    while (cin >> ws && cin.peek() != EOF) {\n`;

  sig.args.forEach((arg, i) => {
    wrapper += `        ${arg.cleanType} ${arg.name}{};\n`;
    wrapper +=
      i === 0 ? `        if (!read(${arg.name})) break;\n` : `        read(${arg.name});\n`;
  });

  const call = `${hasSolutionClass ? 'Solution().' : ''}${sig.name}(${sig.args.map(a => a.name).join(', ')})`;
  const isVoid = sig.returnType === 'void' || sig.returnType.endsWith(' void');
  wrapper += isVoid ? `        ${call};\n` : `        cout << ${call} << endl;\n`;
  wrapper += `        cout << "${DELIMITER}" << endl;\n    }\n    return 0;\n}`;
  return wrapper;
}

function generateCWrapper(userCode) {
  return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\n${userCode}\n\nint main() {\n    return 0;\n}`;
}

export function getFullCode(userCode, language = 'cpp') {
  if (language === 'cpp') {
    const struct = detectStructure(userCode);
    if (struct.type === 'class') {
      return generateClassWrapper(stripBoilerplate(userCode), struct.name);
    }
    return generateCppWrapper(userCode, struct.hasSolutionClass);
  }
  if (language === 'c') return generateCWrapper(userCode);
  return userCode;
}
