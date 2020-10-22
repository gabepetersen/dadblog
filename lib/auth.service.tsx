import { resolve } from "path";


export async function apiLogin(username: string, password: string) {
  return new Promise<any>((resolve, reject) => {
    
  });
}
export function apiSignup(email: string, password: string) {
  console.log("signup scope")
  return fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ email: email, pass: password })
  }).then(x => x.json());
}