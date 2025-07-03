const BASE_URL = "https://cep-backend-9jfg.onrender.com";

export async function registerUser(username, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}`,
  });
  return res.text();
}

export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}`,
    credentials: "include", // to handle session cookies
  });
  return res.text();
}
