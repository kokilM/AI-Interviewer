// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CodeEditorService {
//   private apiUrl = 'http://localhost:8080/api'; // Update with your backend URL

//   constructor(private http: HttpClient) {}

//   executeCode(code: string, language: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/execute`, { code, language });
//   }

//   getDefaultCode(language: string): string {
//     const defaultCode: { [key: string]: string } = {
//       java: `public class Solution {
//     public static void main(String[] args) {
//         // Your code here
//         System.out.println("Hello, World!");
//     }
// }`,
//       python: `def main():
//     # Your code here
//     print("Hello, World!")

// if __name__ == "__main__":
//     main()`,
//       cpp: `#include <iostream>

// int main() {
//     // Your code here
//     std::cout << "Hello, World!" << std::endl;
//     return 0;
// }`,
//       typescript: `function main() {
//     // Your code here
//     console.log("Hello, World!");
// }

// main();`,
//       javascript: `function main() {
//     // Your code here
//     console.log("Hello, World!");
// }

// main();`
//     };

//     return defaultCode[language] || defaultCode['java'];
//   }
// } 