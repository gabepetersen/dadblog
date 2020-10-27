import { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router';

// Big thank you to Jesse Heaslip for this wonderful article
// https://blog.bitsrc.io/email-confirmation-with-react-257e5d9de725

// this is annoying, we should fix later
import User from '../../../../server/db-schemas/user';

// This function basically sets the User confirmed value to true
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get id
  const router = useRouter();
  const { id } = router.query;

  var user = null;
  try {
    user = await User.findById(id);
  } catch (err) {
    res.status(400).json({ text: `Could Not Get User: ${err}`, code: 0 });
  }
  // if no user exists under the id, return error response
  if (!user) {
    res.status(404).json({ text: "User not Found", code: 0 });
  // if the user is found but not confirmed, update them to confirmed
  } else if (user && !user.confirmed) {
    try {
      await User.findByIdAndUpdate(id, { confirmed: true })
      res.status(201).json({ text: "Email Confirmed!", code: 0 });
    } catch (err) {
      console.error(err);
      res.status(400).json({ text: `Could Not Update User: ${err}`, code: 0 });
    }
  // if the user is already confirmed => do nothing
  } else {
    res.status(100).json({ text: "Email already Confirmed", code: 0 });
  }
}