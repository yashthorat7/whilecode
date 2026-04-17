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

template<typename T> void read(T& x) {
    while (cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
    cin >> x;
}
void read(string& x) {
    while (cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
    if (cin.peek() == '"') {
        cin.ignore(); getline(cin, x, '"');
    } else { cin >> x; }
}
template<typename T1, typename T2> void read(pair<T1,T2>& p) {
    char c;
    while (cin && isspace(cin.peek())) cin.ignore();
    if (cin.peek() == '(') {
        cin >> c; read(p.first);
        while (cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
        read(p.second);
        while (cin && (isspace(cin.peek()) || cin.peek() == ')')) cin.ignore();
    } else { read(p.first); read(p.second); }
}
template<typename T> void read(vector<T>& v) {
    while (cin && isspace(cin.peek())) cin.ignore();
    if (cin.peek() == '[') {
        char c; cin >> c;
        while (cin) {
            while (cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
            if (cin.peek() == ']') { cin.ignore(); break; }
            if (cin.peek() == EOF) break;
            T x; 
            if (cin >> x) {
                v.push_back(x);
                // After reading a value, skip any following comma to handle [1, 2,] or [1, 2]
                while (cin && (isspace(cin.peek()) || cin.peek() == ',')) {
                    if (cin.peek() == ']') break;
                    cin.ignore();
                }
            } else { 
                cin.clear();
                string s; cin >> s; // Skip invalid token
                if (s == "]" || s == "],") break;
            }
        }
    } else {
        string line;
        if (getline(cin, line)) {
            istringstream iss(line);
            T x;
            while (iss >> x) v.push_back(x);
        }
    }
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

void read(ListNode*& head) {
    vector<int> v;
    read(v);
    if(v.empty()) { head = nullptr; return; }
    head = new ListNode(v[0]);
    ListNode* curr = head;
    for(size_t i=1; i<v.size(); ++i) { curr->next = new ListNode(v[i]); curr = curr->next; }
}

void read(TreeNode*& root) {
    while(cin && isspace(cin.peek())) cin.ignore();
    if (cin.peek() == '[') {
        char c; cin >> c;
        vector<string> v;
        while(cin) {
            while (cin && (isspace(cin.peek()) || cin.peek() == ',')) cin.ignore();
            if (cin.peek() == ']') { cin.ignore(); break; }
            if (cin.peek() == EOF) break;
            string s;
            while(cin && cin.peek() != ',' && cin.peek() != ']' && !isspace(cin.peek())) {
                s += cin.get();
            }
            if (!s.empty()) v.push_back(s);
        }
        if (v.empty()) { root = nullptr; return; }
        if (v[0] == "null") { root = nullptr; return; }
        root = new TreeNode(stoi(v[0]));
        queue<TreeNode*> q;
        q.push(root);
        size_t i = 1;
        while(!q.empty() && i < v.size()) {
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
    } else {
        root = nullptr;
    }
}

ostream& operator<<(ostream& os, ListNode* head) {
    os << "[";
    while(head) { os << head->val; if (head->next) os << ","; head = head->next; }
    os << "]"; return os;
}

ostream& operator<<(ostream& os, TreeNode* root) {
    if (!root) return os << "[]";
    os << "[";
    queue<TreeNode*> q;
    q.push(root);
    vector<string> res;
    while(!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        if (curr) {
            res.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        } else {
            res.push_back("null");
        }
    }
    while(!res.empty() && res.back() == "null") res.pop_back();
    for(size_t i=0; i<res.size(); ++i) {
        if(i) os << ",";
        os << res[i];
    }
    os << "]";
    return os;
}
`;

function detectStructure(fullCode) {
  if (!fullCode) return { type: 'function' };
  const lines = fullCode.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('class ')) {
      const match = line.match(/class\s+(\w+)/);
      return { type: 'class', name: match ? match[1] : 'Solution' };
    }
  }
  return { type: 'function' };
}

function extractClass(fullCode) {
  if (!fullCode) return '';
  const lines = fullCode.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('class ')) {
      start = i;
      break;
    }
  }
  if (start === -1) return fullCode;
  return lines.slice(start).join('\n').trim();
}

function extractFunction(fullCode) {
  if (!fullCode) return '';
  const lines = fullCode.split('\n');
  const funcRegex = /^[a-zA-Z0-9_<>:,\s*&]+[ \t]+[a-zA-Z0-9_]+[ \t]*\([^{]*\)[ \t]*{/;
  let functionStart = -1;
  let inTemplate = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      !line ||
      line.startsWith('#include') ||
      line.startsWith('using namespace') ||
      (line.startsWith('//') && i < 10)
    )
      continue;
    if (line.startsWith('template<')) {
      inTemplate = true;
      continue;
    }
    if (inTemplate) {
      if (line.includes('}')) inTemplate = false;
      continue;
    }
    if (line.includes('operator<<') || line.includes('void read(') || line.startsWith('class '))
      continue;
    if (funcRegex.test(line) && !line.includes('int main')) functionStart = i;
  }

  if (functionStart === -1) return fullCode;

  const result = [];
  for (let i = functionStart; i < lines.length; i++) {
    if (lines[i].includes('int main')) break;
    result.push(lines[i]);
  }
  return result.join('\n').trim();
}

function generateClassWrapper(classCode, className) {
  return `
#include <bits/stdc++.h>
using namespace std;
${CPP_INPUT_HELPERS}
${CPP_LEETCODE_STRUCTS}

${classCode}

template<typename T>
T parseArg(const string& s) {
    if (s == "null") return T();
    stringstream ss(s);
    T res; ss >> res;
    return res;
}

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL); cout << boolalpha;
    vector<string> cmds;
    while (cin >> ws && cin.peek() != EOF) {
        if (!(cin >> cmds)) break;
        vector<vector<string>> params;
        read(params);
        if (cmds.empty()) break;

        ${className}* obj = nullptr;
        cout << "[";
        for (size_t i = 0; i < cmds.size(); ++i) {
            if (i) cout << ",";
            string cmd = cmds[i];
            vector<string> p = params[i];

            if (cmd == "${className}") {
                if (p.empty()) obj = new ${className}();
                else if (p.size() == 1) obj = new ${className}(parseArg<int>(p[0]));
                else if (p.size() == 2) obj = new ${className}(parseArg<int>(p[0]), parseArg<int>(p[1]));
                cout << "null";
            } else if (obj) {
                if (cmd == "push") { obj->push(parseArg<int>(p[0])); cout << "null"; }
                else if (cmd == "push_back") { obj->push_back(parseArg<int>(p[0])); cout << "null"; }
                else if (cmd == "push_front") { obj->push_front(parseArg<int>(p[0])); cout << "null"; }
                else if (cmd == "pop") { obj->pop(); cout << "null"; }
                else if (cmd == "pop_back") { obj->pop_back(); cout << "null"; }
                else if (cmd == "pop_front") { obj->pop_front(); cout << "null"; }
                else if (cmd == "top") cout << obj->top();
                else if (cmd == "peek") cout << obj->peek();
                else if (cmd == "front") cout << obj->front();
                else if (cmd == "back") cout << obj->back();
                else if (cmd == "empty" || cmd == "isEmpty") cout << obj->empty();
                else if (cmd == "size") cout << obj->size();
                else if (cmd == "get") cout << obj->get(parseArg<int>(p[0]));
                else if (cmd == "put") { obj->put(parseArg<int>(p[0]), parseArg<int>(p[1])); cout << "null"; }
                else if (cmd == "add" || cmd == "addAtHead" || cmd == "addAtTail") { 
                    if (p.size() == 1) obj->add(parseArg<int>(p[0]));
                    else if (p.size() == 2) obj->add(parseArg<int>(p[0]), parseArg<int>(p[1]));
                    cout << "null"; 
                }
                else if (cmd == "remove" || cmd == "deleteAtIndex") { obj->remove(parseArg<int>(p[0])); cout << "null"; }
                else if (cmd == "find") cout << obj->find(parseArg<int>(p[0]));
                else if (cmd == "search") cout << obj->search(parseArg<int>(p[0]));
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

function generateCppWrapper(functionCode) {
  if (!functionCode) return '';
  const match = functionCode.match(/([\w\s<>:,*&]+)\s+(\w+)\s*\(([^)]*)\)/);
  if (!match) return `#include <bits/stdc++.h>\nusing namespace std;\n\n${functionCode}`;

  const returnType = match[1].trim();
  const functionName = match[2];
  const args = match[3]
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const parts = s.split(/\s+/);
      const name = parts[parts.length - 1].replace(/[*&]/g, '');
      const cleanType = parts
        .slice(0, -1)
        .join(' ')
        .replace(/\bconst\b/g, '')
        .replace(/[&]/g, '')
        .trim();
      return { cleanType, name };
    });

  let wrapper = `#include <bits/stdc++.h>\nusing namespace std;\n${CPP_INPUT_HELPERS}\n${CPP_LEETCODE_STRUCTS}\n${functionCode}\n\nint main() {\n    ios_base::sync_with_stdio(false); cin.tie(NULL); cout << boolalpha;\n    while (cin >> ws && cin.peek() != EOF) {\n`;

  args.forEach((arg, i) => {
    wrapper += `        ${arg.cleanType} ${arg.name};\n        read(${arg.name});\n`;
    if (i === 0 && arg.cleanType.includes('vector'))
      wrapper += `        if (${arg.name}.empty()) break;\n`;
  });

  const isVoid = returnType === 'void' || returnType.endsWith(' void');
  wrapper += isVoid
    ? `        ${functionName}(${args.map(a => a.name).join(', ')});\n`
    : `        cout << ${functionName}(${args.map(a => a.name).join(', ')}) << endl;\n`;

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
      return generateClassWrapper(extractClass(userCode), struct.name);
    }
    return generateCppWrapper(extractFunction(userCode));
  }
  if (language === 'c') return generateCWrapper(userCode);
  return userCode;
}
