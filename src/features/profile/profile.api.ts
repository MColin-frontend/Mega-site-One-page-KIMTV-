import { getRequest, postRequest } from "@/server/services/request"

import type { ProfileStatsInterface, UpdateProfilePayloadInterface } from "./profile.models"

export async function fetchProfileStatsAction(userId: string): Promise<ProfileStatsInterface> {
  const res = await getRequest<ProfileStatsInterface>(`/user/stats/${userId}`)
  return res ?? { matchesWatched: 0, leaguesFollowed: 0, commentsPosted: 0 }
}

export async function updateProfileAction(
  userId: string,
  payload: UpdateProfilePayloadInterface
): Promise<boolean> {
  const res = await postRequest<boolean>(`/user/profile/${userId}`, payload)
  return res ?? false
}
