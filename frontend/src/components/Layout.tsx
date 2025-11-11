import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { useGetCurrentUserQuery } from '../features/auth/authApi';
import { Role } from '../types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { GlobalAlerts } from './GlobalAlerts';
import { pushNotification } from '../features/notifications/notificationsSlice';

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  // Fetch current user if token exists but user data is not loaded
  const token = useAppSelector((state) => state.auth.token);
  const { error } = useGetCurrentUserQuery(undefined, {
    skip: !token || !!user, // Skip if no token or user already loaded
  });

  // Handle auth errors - dispatch logout to sync Redux state
  useEffect(() => {
    if (error) {
      dispatch(logout());
      navigate('/login');
    }
  }, [error, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const hasRole = (roles: Role[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'destructive';
      case Role.ENGINEER:
        return 'default';
      case Role.VIEWER:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Realtime notifications via SSE
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
    const url = `${base}/api/v1/events`;
    const es = new EventSource(url, { withCredentials: false });

    es.addEventListener('repair-plan.created', (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data);
        const priority = payload?.plan?.priority ?? 'UNKNOWN';
        const cost = payload?.plan?.totalEstimatedCost ?? 0;
        dispatch(
          pushNotification({
            type: 'info',
            title: 'Repair plan generated',
            message: `Priority ${priority} • Estimated cost $${Number(
              cost
            ).toFixed(2)}`,
          })
        );
      } catch {
        // ignore parse errors
      }
    });

    es.onerror = () => {
      // Silently close on error; it may auto-reconnect
    };

    return () => {
      es.close();
    };
    // Intentionally no deps to keep a single connection for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalAlerts />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Horizon
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/turbines">
                <Button variant="ghost">Turbines</Button>
              </Link>

              <Link to="/inspections">
                <Button variant="ghost">Inspections</Button>
              </Link>

              {hasRole([Role.ADMIN, Role.ENGINEER]) && (
                <Link to="/repair-plans">
                  <Button variant="ghost">Repair Plans</Button>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      {user ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
