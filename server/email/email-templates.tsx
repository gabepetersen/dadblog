export function confirmTemplate(id) {
  return {
    subject: 'Confirm Email For DadBlog',
    html: `
      <a href='${process.env.CLIENT_ORIGIN}/confirm-email/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: ${process.env.CLIENT_ORIGIN}/confirm-email/${id}`
  }
}