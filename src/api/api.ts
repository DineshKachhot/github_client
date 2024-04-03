import { QueryFunction } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers: QueryFunction<
  Developer[],
  (string | number)[],
  number
> = async ({ pageParam = 0 }) => {
  const access_token = process.env.EXPO_PUBLIC_REACT_APP_GITHUB_TOKEN;
  try {
    const res = await axios.get<Developer[]>("https://api.github.com/users", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `token ${access_token}`,
      },
      params: {
        per_page: 30,
        since: pageParam,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

const fetchUser = async (id: string) => {
  const access_token = process.env.EXPO_PUBLIC_REACT_APP_GITHUB_TOKEN;
  try {
    const res = await axios.get<DeveloperDetails>(
      `https://api.github.com/users/${id}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `token ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

export { fetchUsers, fetchUser };
