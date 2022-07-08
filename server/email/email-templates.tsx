export function confirmTemplate(id) {
  return {
    subject: 'Confirm Email For Mutual Threads',
    html: `
      <a href='${process.env.CLIENT_URL}confirm-email/${id}'>
        Click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: ${process.env.CLIENT_URL}confirm-email/${id}`
  }
}