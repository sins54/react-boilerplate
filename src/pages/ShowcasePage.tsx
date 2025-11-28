import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Text,
  Box,
  Stack,
  Separator,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  AspectRatio,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from "../components";

type Theme = "light" | "dark" | "system";

/**
 * ShowcasePage - A comprehensive visual test suite for all UI components.
 * This page displays all available components and allows instant Light/Dark mode toggling.
 * 
 * Access: Public in development, can be wrapped with ProtectedRoute in production.
 * Route: /showcase
 */
export default function ShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light", "dark");
    }
  }, [theme]);

  return (
    <TooltipProvider>
      <div
        className="min-h-screen p-8"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Header with Theme Toggle */}
          <Stack gap="md" className="mb-8">
            <Stack
              direction="horizontal"
              justify="between"
              align="center"
              wrap="wrap"
              gap="md"
            >
              <div>
                <Link
                  to="/"
                  className="text-sm"
                  style={{ color: "var(--color-primary)" }}
                >
                  ← Back to Home
                </Link>
                <Text as="h1" size="4xl" weight="bold" className="mt-2">
                  Component Showcase
                </Text>
                <Text textColor="secondary" size="lg">
                  Visual test suite for all UI components
                </Text>
              </div>

              {/* Theme Toggle */}
              <Stack direction="horizontal" gap="sm">
                <ThemeButton
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                  label="Light"
                  icon="☀️"
                />
                <ThemeButton
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  label="Dark"
                  icon="🌙"
                />
                <ThemeButton
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                  label="System"
                  icon="💻"
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Component Grid Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Typography Section */}
            <Section title="Typography">
              <Stack gap="sm">
                <Text as="h1" size="4xl" weight="bold">
                  Heading 1
                </Text>
                <Text as="h2" size="3xl" weight="semibold">
                  Heading 2
                </Text>
                <Text as="h3" size="2xl" weight="medium">
                  Heading 3
                </Text>
                <Text as="p" size="base">
                  Body text (base)
                </Text>
                <Text as="p" size="sm" textColor="secondary">
                  Secondary text
                </Text>
                <Text as="p" size="xs" textColor="muted">
                  Muted text
                </Text>
                <Stack direction="horizontal" gap="md" wrap="wrap">
                  <Text textColor="primary">Primary</Text>
                  <Text textColor="success">Success</Text>
                  <Text textColor="warning">Warning</Text>
                  <Text textColor="error">Error</Text>
                </Stack>
              </Stack>
            </Section>

            {/* Buttons Section */}
            <Section title="Buttons">
              <Stack gap="md">
                <Stack direction="horizontal" gap="sm" wrap="wrap">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </Stack>
                <Stack direction="horizontal" gap="sm" wrap="wrap">
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </Stack>
                <Stack direction="horizontal" gap="sm" wrap="wrap">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">⚙</Button>
                </Stack>
              </Stack>
            </Section>

            {/* Badges Section */}
            <Section title="Badges">
              <Stack gap="md">
                <Text size="sm" weight="medium">
                  Solid Variants
                </Text>
                <Stack direction="horizontal" gap="sm" wrap="wrap">
                  <Badge>Default</Badge>
                  <Badge colorScheme="primary">Primary</Badge>
                  <Badge colorScheme="success">Success</Badge>
                  <Badge colorScheme="warning">Warning</Badge>
                  <Badge colorScheme="error">Error</Badge>
                </Stack>
                <Text size="sm" weight="medium">
                  Outline Variants
                </Text>
                <Stack direction="horizontal" gap="sm" wrap="wrap">
                  <Badge variant="outline">Default</Badge>
                  <Badge variant="outline" colorScheme="primary">
                    Primary
                  </Badge>
                  <Badge variant="outline" colorScheme="success">
                    Success
                  </Badge>
                  <Badge variant="outline" colorScheme="warning">
                    Warning
                  </Badge>
                  <Badge variant="outline" colorScheme="error">
                    Error
                  </Badge>
                </Stack>
              </Stack>
            </Section>

            {/* Avatar Section */}
            <Section title="Avatar">
              <Stack direction="horizontal" gap="md" align="center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarFallback>XY</AvatarFallback>
                </Avatar>
              </Stack>
            </Section>

            {/* Card Section */}
            <Section title="Card" fullWidth>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description text.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Text textColor="secondary">Card content goes here.</Text>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm" className="ml-2">
                      Save
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <Stack direction="horizontal" align="center" gap="md">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Stack gap="xs">
                        <CardTitle className="text-lg">John Doe</CardTitle>
                        <CardDescription>Software Engineer</CardDescription>
                      </Stack>
                    </Stack>
                  </CardHeader>
                  <CardContent>
                    <Text size="sm" textColor="secondary">
                      Building great products with React and TypeScript.
                    </Text>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Box & Stack Section */}
            <Section title="Box & Stack">
              <Stack gap="md">
                <Text size="sm" weight="medium">
                  Horizontal Stack
                </Text>
                <Stack direction="horizontal" gap="md" align="center">
                  <Box
                    padding="md"
                    rounded="md"
                    className="bg-[color:var(--color-primary)]"
                  >
                    <Text className="text-[color:var(--color-text-on-primary)]">
                      Box 1
                    </Text>
                  </Box>
                  <Box
                    padding="md"
                    rounded="md"
                    className="bg-[color:var(--color-success)]"
                  >
                    <Text className="text-[color:var(--color-text-on-primary)]">
                      Box 2
                    </Text>
                  </Box>
                  <Box
                    padding="md"
                    rounded="md"
                    className="bg-[color:var(--color-warning)]"
                  >
                    <Text className="text-[color:var(--color-text-on-primary)]">
                      Box 3
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Section>

            {/* Separator Section */}
            <Section title="Separator">
              <Stack gap="md">
                <Text>Content above separator</Text>
                <Separator />
                <Text>Content below separator</Text>
              </Stack>
            </Section>

            {/* Accordion Section */}
            <Section title="Accordion" fullWidth>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is this component library?
                  </AccordionTrigger>
                  <AccordionContent>
                    A reusable component library built with React, Tailwind CSS
                    v4, and Radix UI primitives.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All components are built on top of Radix UI primitives,
                    which provide excellent accessibility.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I customize the styles?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely. Components use CSS variables from the design
                    system, making them easy to customize.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>

            {/* Collapsible Section */}
            <Section title="Collapsible">
              <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
                <Stack gap="sm">
                  <Stack direction="horizontal" align="center" gap="md">
                    <Text weight="medium">Expandable Content</Text>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {collapsibleOpen ? "Hide" : "Show"}
                      </Button>
                    </CollapsibleTrigger>
                  </Stack>
                  <CollapsibleContent>
                    <Box
                      padding="md"
                      rounded="md"
                      className="border border-[color:var(--color-border)] bg-[color:var(--color-surface-hover)]"
                    >
                      <Text textColor="secondary">
                        This is the collapsible content that can be toggled.
                      </Text>
                    </Box>
                  </CollapsibleContent>
                </Stack>
              </Collapsible>
            </Section>

            {/* Aspect Ratio Section */}
            <Section title="AspectRatio">
              <AspectRatio ratio={16 / 9}>
                <div
                  className="flex items-center justify-center rounded-md w-full h-full"
                  style={{
                    backgroundColor: "var(--color-surface-hover)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Text textColor="muted">16:9 Aspect Ratio</Text>
                </div>
              </AspectRatio>
            </Section>

            {/* Breadcrumb Section */}
            <Section title="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Section>

            {/* Tabs Section */}
            <Section title="Tabs" fullWidth>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList>
                  <TabsTrigger value="tab1">Account</TabsTrigger>
                  <TabsTrigger value="tab2">Settings</TabsTrigger>
                  <TabsTrigger value="tab3">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <Box
                    padding="md"
                    rounded="md"
                    className="mt-2 border border-[color:var(--color-border)]"
                  >
                    <Text textColor="secondary">
                      Account settings content would go here.
                    </Text>
                  </Box>
                </TabsContent>
                <TabsContent value="tab2">
                  <Box
                    padding="md"
                    rounded="md"
                    className="mt-2 border border-[color:var(--color-border)]"
                  >
                    <Text textColor="secondary">
                      Configuration settings content would go here.
                    </Text>
                  </Box>
                </TabsContent>
                <TabsContent value="tab3">
                  <Box
                    padding="md"
                    rounded="md"
                    className="mt-2 border border-[color:var(--color-border)]"
                  >
                    <Text textColor="secondary">
                      Notification preferences content would go here.
                    </Text>
                  </Box>
                </TabsContent>
              </Tabs>
            </Section>

            {/* Dropdown Menu Section */}
            <Section title="Dropdown Menu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Section>

            {/* Dialog Section */}
            <Section title="Dialog">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  <Stack gap="md" className="py-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full px-3 py-2 rounded-md outline-none"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 rounded-md outline-none"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </Stack>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>

            {/* Popover Section */}
            <Section title="Popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Stack gap="sm">
                    <Text weight="medium">Popover Content</Text>
                    <Text size="sm" textColor="secondary">
                      This is a popover with some content inside.
                    </Text>
                  </Stack>
                </PopoverContent>
              </Popover>
            </Section>

            {/* Tooltip Section */}
            <Section title="Tooltip">
              <Stack direction="horizontal" gap="md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text size="sm">This is a tooltip!</Text>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">Another tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text size="sm">Another helpful message</Text>
                  </TooltipContent>
                </Tooltip>
              </Stack>
            </Section>
          </div>

          {/* Footer */}
          <footer
            className="pt-8 mt-12 text-center"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <Text textColor="muted">
              Component Showcase v1.0 • Built with React + Vite + Tailwind CSS
              v4 + Radix UI
            </Text>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* Theme Button Component */
interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

function ThemeButton({ active, onClick, label, icon }: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
      style={{
        backgroundColor: active
          ? "var(--color-primary)"
          : "var(--color-surface)",
        color: active ? "var(--color-text-on-primary)" : "var(--color-text)",
        border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* Section Component */
interface SectionProps {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function Section({ title, children, fullWidth }: SectionProps) {
  return (
    <section className={fullWidth ? "md:col-span-2" : ""}>
      <Text as="h2" size="lg" weight="semibold" className="mb-3">
        {title}
      </Text>
      <Box
        padding="lg"
        rounded="lg"
        className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] h-full"
      >
        {children}
      </Box>
    </section>
  );
}
