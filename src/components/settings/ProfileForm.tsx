"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, useRef } from "react";
import { Camera } from "lucide-react";

// Form schema only for editable fields
const profileFormSchema = z.object({
  name: z.string().min(1, { message: "İsim gerekli." }).max(50, { message: "İsim en fazla 50 karakter olabilir."}),
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  avatarUrl: z.string().url({ message: "Geçerli bir URL girin." }).optional(),
});

// Values for the form
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (values: ProfileFormValues) => void;
}

const getInitials = (name: string = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(profile.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      avatarUrl: profile.avatarUrl || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: profile.name || "",
      email: profile.email || "",
      avatarUrl: profile.avatarUrl || "",
    });
    setImagePreviewUrl(profile.avatarUrl || `https://picsum.photos/seed/${profile.email}/128/128`);
  }, [profile, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreviewUrl(dataUri);
        form.setValue("avatarUrl", dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: ProfileFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Profil Bilgileri</CardTitle>
        <CardDescription>Kişisel bilgilerinizi ve profil fotoğrafınızı buradan güncelleyebilirsiniz.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 text-4xl border-2 border-primary shadow-md">
                  <AvatarImage src={imagePreviewUrl || undefined} alt={profile.name} data-ai-hint="profile editor avatar"/>
                  <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/80 group-hover:bg-background transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Profil fotoğrafını değiştir"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="avatarUrl" // This field will store the data URI, not for direct user input
                render={({ field }) => (
                  <FormItem className="hidden"> {/* Hidden because file input handles this */}
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                />
                <Button type="button" variant="link" onClick={() => fileInputRef.current?.click()}>
                  Fotoğrafı Değiştir
                </Button>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İsim Soyisim</FormLabel>
                  <FormControl>
                    <Input placeholder="Adınız Soyadınız" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="eposta@adresiniz.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Bilgileri Kaydet</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}