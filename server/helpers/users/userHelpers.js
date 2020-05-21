import { User } from "../../models";
import { escapeStringForHtml } from "../generalHelpers";

export async function updateUserLastVisited(userId) {
  await User.updateOne(
    { _id: userId },
    {
      lastVisited: new Date(),
      sentOneMonthDeleteReminder: false,
      updatedAt: new Date()
    }
  );
}

export function escapeUserObject(user) {
  user.username = escapeStringForHtml(user.username);
  user.email = escapeStringForHtml(user.email);
  return user;
}
