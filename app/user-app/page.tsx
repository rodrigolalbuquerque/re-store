import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import UserAppHeader from "@/components/user-app/UserAppHeader";
import { UserAppSidebar } from "@/components/user-app/UserAppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ImageUploadPlaceHolder } from "@/components/user-app/ImageUploadPlaceHolder";

export default async function UserApp() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) loggedIn = true;
  } catch (error) {
    console.log("UserApp", error);
  } finally {
    if (!loggedIn) redirect("/", RedirectType.replace);
  }

  return (
    <>
      <div className="md:block">
        <UserAppHeader />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <UserAppSidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="documents" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="documents" className="relative">
                          Documents
                        </TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        <TabsTrigger value="live" disabled>
                          Other
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircleIcon className="mr-2 h-4 w-4" />
                          Add media
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="documents"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Listen Now
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      {/* <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {listenNowAlbums.map((album) => (
                              <AlbumArtwork
                                key={album.name}
                                album={album}
                                className="w-[250px]"
                                aspectRatio="portrait"
                                width={250}
                                height={330}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div> */}
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                    </TabsContent>
                    <TabsContent
                      value="photos"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Photo Collection
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Photos you already enhanced
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <ImageUploadPlaceHolder />
                      {/* <PodcastEmptyPlaceholder /> */}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
