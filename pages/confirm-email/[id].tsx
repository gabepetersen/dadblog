import { useRouter } from 'next/router';

export default function Confirm() {
  const router = useRouter();
  const { id } = router.query;
  var confirmMsg = 'Confirming Email...'

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

  return (
    <div>
      <p>{confirmMsg}</p>
    </div>
  )
}