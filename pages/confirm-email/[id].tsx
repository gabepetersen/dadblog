import { useRouter } from 'next/router';

export default function Confirm() {
  const router = useRouter();
  const { id } = router.query;
  console.log("Here is the id: " + id);
  var confirmMsg = 'Confirming Email...'

  if (id) {
    fetch(`/api/email/confirm/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    }).then(x => x.json()).then(data => {
      confirmMsg = data;
      // Navigate Back Home after Fetch
      router.push('/');
    });
  } else {
    console.error("confirmation id is not valid");
  }
  

  return (
    <div>
      <p>{confirmMsg}</p>
    </div>
  )
}