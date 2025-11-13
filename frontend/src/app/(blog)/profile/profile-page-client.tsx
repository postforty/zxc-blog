"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import ProfileSkeleton from "../../../components/skeletons/ProfileSkeleton";

const ProfilePageClient = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        await login(accessToken);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t("invalid_credentials"));
      }
    } catch (err) {
      setError(t("failed_to_login"));
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{t("profile_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <Button onClick={logout} className="mt-4">
                  {t("logout")}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit">{t("login")}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePageClient;
