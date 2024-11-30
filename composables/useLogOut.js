export const useAuth = () => {
  const router = useRouter();

  const logout = () => {
    const authCookie = useCookie("token");
    authCookie.value = null;
    router.push({ name: "index" });
  };

  return {
    logout,
  };
};
