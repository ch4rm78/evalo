import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  LogOutIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useEndSession } from "../hooks/useSessions";
import { useQueryClient } from "@tanstack/react-query";

function ActiveSessions({ sessions, isLoading, isUserInSession, user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const endSessionMutation = useEndSession();

  const handleEndSession = (sessionId, e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to end this session?")) {
      endSessionMutation.mutate(sessionId, {
        onSuccess: () => {
          // Invalidate and refetch active sessions without full page reload
          queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
        },
      });
    }
  };

  const isHost = (session) => {
    return session.host?.clerkId === user?.id;
  };

  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 hover:border-primary/30 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <ZapIcon className="size-5" />
            </div>
            <h2 className="text-2xl font-black">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-success rounded-full" />
            <span className="text-sm font-medium text-success">
              {sessions.length} active
            </span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="card bg-base-200 border-2 border-base-300 hover:border-primary/50"
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative size-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-base-100" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate">
                          {session.problem}
                        </h3>
                        <span
                          className={`badge badge-sm ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">
                            {session.host?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">
                            {session.participant ? "2/2" : "1/2"}
                          </span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="badge badge-error badge-sm">
                            FULL
                          </span>
                        ) : (
                          <span className="badge badge-success badge-sm">
                            OPEN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isHost(session) ? (
                    <div className="flex gap-2">
                      <Link
                        to={`/session/${session._id}`}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        Rejoin
                        <ArrowRightIcon className="size-4" />
                      </Link>
                      <button
                        onClick={(e) => handleEndSession(session._id, e)}
                        disabled={endSessionMutation.isPending}
                        className="btn btn-error btn-sm gap-2"
                      >
                        {endSessionMutation.isPending ? (
                          <LoaderIcon className="size-4 animate-spin" />
                        ) : (
                          <LogOutIcon className="size-4" />
                        )}
                        End
                      </button>
                    </div>
                  ) : session.participant && !isUserInSession(session) ? (
                    <button className="btn btn-disabled btn-sm">Full</button>
                  ) : (
                    <Link
                      to={`/session/${session._id}`}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-primary/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">
                No active sessions
              </p>
              <p className="text-sm opacity-50">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;
