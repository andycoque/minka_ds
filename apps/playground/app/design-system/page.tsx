import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarDemo } from "./sidebar-demo"

export default function DesignSystemPlayground() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-16">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground text-lg">
            minka-product-ui — component playground & token reference
          </p>
          <Separator className="mt-6" />
        </div>

        <Tabs defaultValue="components">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          {/* ── Components tab ─────────────────────────────────── */}
          <TabsContent value="components" className="space-y-10 pt-6">

            {/* Buttons */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Button</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="icon">+</Button>
              </div>
            </section>

            <Separator />

            {/* Badges */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Badge</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge>Default</Badge>
                <Badge variant="filled">Filled</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </div>
            </section>

            <Separator />

            {/* Form elements */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Form</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="example-input">Input</Label>
                  <Input id="example-input" placeholder="Enter text…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="example-input-disabled">Disabled input</Label>
                  <Input id="example-input-disabled" placeholder="Disabled" disabled />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="example-textarea">Textarea</Label>
                  <Textarea id="example-textarea" placeholder="Enter longer text…" rows={3} />
                </div>
              </div>
            </section>

            <Separator />

            {/* Cards */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Card</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Supporting description text below the title.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Card body content goes here. Cards are the primary surface for grouping related information.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle>Dashed variant</CardTitle>
                    <CardDescription>Used for empty states or add-new slots.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">+ Add item</Button>
                  </CardContent>
                </Card>
              </div>
            </section>
            <Separator />

            {/* Select */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Select</h2>
              <div className="flex flex-wrap gap-4 items-start">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="mango">Mango</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select disabled>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Disabled" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            <Separator />

            {/* Separator */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Separator</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Horizontal</p>
                  <Separator />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Vertical</p>
                  <div className="flex items-center gap-3 h-8">
                    <span className="text-sm">Left</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">Right</span>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Tabs */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Tabs</h2>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Default</p>
                  <Tabs defaultValue="t1">
                    <TabsList>
                      <TabsTrigger value="t1">Overview</TabsTrigger>
                      <TabsTrigger value="t2">Activity</TabsTrigger>
                      <TabsTrigger value="t3">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="t1"><p className="text-sm pt-3 text-muted-foreground">Overview content.</p></TabsContent>
                    <TabsContent value="t2"><p className="text-sm pt-3 text-muted-foreground">Activity content.</p></TabsContent>
                    <TabsContent value="t3"><p className="text-sm pt-3 text-muted-foreground">Settings content.</p></TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Line variant</p>
                  <Tabs defaultValue="t1">
                    <TabsList variant="line">
                      <TabsTrigger value="t1">Overview</TabsTrigger>
                      <TabsTrigger value="t2">Activity</TabsTrigger>
                      <TabsTrigger value="t3">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="t1"><p className="text-sm pt-3 text-muted-foreground">Overview content.</p></TabsContent>
                    <TabsContent value="t2"><p className="text-sm pt-3 text-muted-foreground">Activity content.</p></TabsContent>
                    <TabsContent value="t3"><p className="text-sm pt-3 text-muted-foreground">Settings content.</p></TabsContent>
                  </Tabs>
                </div>
              </div>
            </section>

            <Separator />

            {/* Dialog */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Dialog</h2>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm action</DialogTitle>
                      <DialogDescription>This action cannot be undone. Are you sure you want to continue?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </section>

            <Separator />

            {/* Sheet */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Sheet</h2>
              <div className="flex gap-3 flex-wrap">
                {(["right", "left", "bottom"] as const).map((side) => (
                  <Sheet key={side}>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open {side}</Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                      <SheetHeader>
                        <SheetTitle>Sheet — {side}</SheetTitle>
                        <SheetDescription>Supporting description for this sheet panel.</SheetDescription>
                      </SheetHeader>
                      <div className="px-4 flex-1">
                        <p className="text-sm text-muted-foreground">Sheet body content goes here.</p>
                      </div>
                      <SheetFooter>
                        <Button>Save changes</Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </section>

            <Separator />

            {/* Sidebar */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Sidebar</h2>
              <SidebarDemo />
            </section>

          </TabsContent>

          {/* ── Tokens tab ─────────────────────────────────────── */}
          <TabsContent value="tokens" className="space-y-10 pt-6">

            {/* Color primitives */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Color primitives</h2>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">--primitive-[scale]-[step]</code>
              </p>

              {[
                { name: "neutral",    steps: ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "1000"] },
                { name: "red",        steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "bronze",     steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "yellow",     steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "lulo",       steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "green",      steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "aquamarine", steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "sea",        steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "blue",       steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "purple",     steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "fuchsia",    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "flamingo",   steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
              ].map(({ name, steps }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 capitalize">{name}</span>
                  <div className="flex gap-0.5 flex-1">
                    {steps.map((step) => (
                      <div
                        key={step}
                        className="flex-1 h-8 rounded-sm first:rounded-l-md last:rounded-r-md"
                        style={{ backgroundColor: `var(--primitive-${name}-${step})` }}
                        title={`--primitive-${name}-${step}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <Separator />

            {/* Semantic surface tokens */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Semantic surface tokens</h2>
              <p className="text-sm text-muted-foreground">
                These map to shadcn slots and are what components consume.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["background", "background"],
                  ["card",       "card"],
                  ["muted",      "muted"],
                  ["primary",    "primary"],
                  ["secondary",  "secondary"],
                  ["accent",     "accent"],
                  ["destructive","destructive"],
                  ["border",     "border"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded shrink-0 border border-border"
                      style={{ backgroundColor: `var(--${token})` }}
                    />
                    <code className="text-xs text-muted-foreground">--{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Text tokens */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Text tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["text-default",      "--color-text-default"],
                  ["text-muted",        "--color-text-muted"],
                  ["text-hint",         "--color-text-hint"],
                  ["text-disabled",     "--color-text-disabled"],
                  ["text-inverse",      "--color-text-inverse"],
                  ["text-link",         "--color-text-link"],
                  ["text-link-hover",   "--color-text-link-hover"],
                  ["text-link-visited", "--color-text-link-visited"],
                  ["text-success",      "--color-text-success"],
                  ["text-error",        "--color-text-error"],
                  ["text-warning",      "--color-text-warning"],
                  ["text-info",         "--color-text-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <span
                      className="text-sm font-medium shrink-0"
                      style={{ color: `var(${token})` }}
                    >
                      Aa
                    </span>
                    <code className="text-xs text-muted-foreground truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Background tokens */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Background tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["bg-canvas",         "--color-bg-canvas"],
                  ["bg-base",           "--color-bg-base"],
                  ["bg-raised",         "--color-bg-raised"],
                  ["bg-overlay",        "--color-bg-overlay"],
                  ["bg-inverted",       "--color-bg-inverted"],
                  ["bg-disabled",       "--color-bg-disabled"],
                  ["bg-success",        "--color-bg-success"],
                  ["bg-error",          "--color-bg-error"],
                  ["bg-warning",        "--color-bg-warning"],
                  ["bg-info",           "--color-bg-info"],
                  ["bg-backdrop",       "--color-bg-backdrop"],
                  ["bg-glass",          "--color-bg-glass"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded shrink-0 border border-border"
                      style={{ backgroundColor: `var(${token})` }}
                    />
                    <code className="text-xs text-muted-foreground truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Border tokens */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Border tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["border-subtle",   "--color-border-subtle"],
                  ["border-default",  "--color-border-default"],
                  ["border-strong",   "--color-border-strong"],
                  ["border-inverse",  "--color-border-inverse"],
                  ["border-focus",    "--color-border-focus"],
                  ["border-disabled", "--color-border-disabled"],
                  ["border-success",  "--color-border-success"],
                  ["border-error",    "--color-border-error"],
                  ["border-warning",  "--color-border-warning"],
                  ["border-info",     "--color-border-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded shrink-0"
                      style={{ border: `2px solid var(${token})` }}
                    />
                    <code className="text-xs text-muted-foreground truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Action tokens */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Action tokens</h2>
              {[
                {
                  variant: "primary",
                  states: ["default", "hover", "pressed", "disabled"],
                },
                {
                  variant: "secondary",
                  states: ["default", "hover", "pressed", "disabled"],
                },
                {
                  variant: "ghost",
                  states: ["default", "hover", "pressed", "disabled"],
                },
                {
                  variant: "destructive",
                  states: ["default", "hover", "pressed", "disabled"],
                },
              ].map(({ variant, states }) => (
                <div key={variant} className="space-y-2">
                  <p className="text-sm font-medium capitalize">{variant}</p>
                  <div className="flex gap-3 flex-wrap">
                    {states.map((state) => (
                      <div key={state} className="flex flex-col items-center gap-1">
                        <div
                          className="w-16 h-8 rounded flex items-center justify-center border border-border/50"
                          style={{
                            backgroundColor: `var(--color-action-${variant}-${state})`,
                            color: state === "disabled"
                              ? "var(--color-text-disabled)"
                              : `var(--color-action-${variant}-foreground)`,
                          }}
                        >
                          <span className="text-[10px] font-medium">Aa</span>
                        </div>
                        <code className="text-[10px] text-muted-foreground">{state}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <Separator />

            {/* Feedback tokens */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Feedback tokens</h2>
              <p className="text-sm text-muted-foreground">Icon and tag colors — not for inline text (use text tokens for that).</p>
              <div className="flex gap-4 flex-wrap">
                {[
                  ["success", "--color-feedback-success"],
                  ["error",   "--color-feedback-error"],
                  ["warning", "--color-feedback-warning"],
                  ["info",    "--color-feedback-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full shrink-0"
                      style={{ backgroundColor: `var(${token})` }}
                    />
                    <code className="text-xs text-muted-foreground">feedback-{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Spacing */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Spacing scale</h2>
              <p className="text-sm text-muted-foreground">
                Mirrors Tailwind's 4px grid. <code className="text-xs bg-muted px-1.5 py-0.5 rounded">--primitive-space-*</code>
              </p>
              <div className="space-y-2">
                {[
                  { step: "1",  rem: "0.25rem", px: "4px"  },
                  { step: "2",  rem: "0.5rem",  px: "8px"  },
                  { step: "3",  rem: "0.75rem", px: "12px" },
                  { step: "4",  rem: "1rem",    px: "16px" },
                  { step: "5",  rem: "1.25rem", px: "20px" },
                  { step: "6",  rem: "1.5rem",  px: "24px" },
                  { step: "8",  rem: "2rem",    px: "32px" },
                  { step: "10", rem: "2.5rem",  px: "40px" },
                  { step: "12", rem: "3rem",    px: "48px" },
                  { step: "16", rem: "4rem",    px: "64px" },
                ].map(({ step, rem, px }) => (
                  <div key={step} className="flex items-center gap-3">
                    <code className="text-[10px] text-muted-foreground w-28 shrink-0">space-{step} · {px}</code>
                    <div
                      className="h-4 bg-primary rounded-sm"
                      style={{ width: `var(--primitive-space-${step})` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{rem}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Radius */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Radius</h2>
              <div className="flex gap-4 flex-wrap items-end">
                {[
                  { token: "--radius-button",  label: "button"  },
                  { token: "--radius-input",   label: "input"   },
                  { token: "--radius-card",    label: "card"    },
                  { token: "--radius-modal",   label: "modal"   },
                  { token: "--radius-popover", label: "popover" },
                  { token: "--radius-tooltip", label: "tooltip" },
                  { token: "--radius-badge",   label: "badge"   },
                  { token: "--radius-tag",     label: "tag"     },
                  { token: "--radius-avatar",  label: "avatar"  },
                ].map(({ token, label }) => (
                  <div key={token} className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 h-12 bg-primary"
                      style={{ borderRadius: `var(${token})` }}
                    />
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </section>

          </TabsContent>

          {/* ── Typography tab ─────────────────────────────────── */}
          <TabsContent value="typography" className="space-y-12 pt-6">

            {/* Font families */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Font families</h2>
              <div className="space-y-3">
                {[
                  { token: "--font-sans",    label: "Sans",    cls: "font-sans",    sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-serif",   label: "Serif",   cls: "font-serif",   sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-heading", label: "Heading", cls: "font-heading", sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-mono",    label: "Mono",    cls: "font-mono",    sample: "const value = tokens.primitive['font-mono']" },
                ].map(({ token, label, cls, sample }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <code className="text-[10px] text-muted-foreground w-32 shrink-0">{token}</code>
                    <p className={`text-base ${cls}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Font sizes */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Font sizes</h2>
              <div className="space-y-2">
                {[
                  { token: "2xs",  cls: "text-[0.625rem]", px: "10px" },
                  { token: "xs",   cls: "text-xs",         px: "12px" },
                  { token: "sm",   cls: "text-sm",         px: "14px" },
                  { token: "base", cls: "text-base",       px: "16px" },
                  { token: "lg",   cls: "text-lg",         px: "18px" },
                  { token: "xl",   cls: "text-xl",         px: "20px" },
                  { token: "2xl",  cls: "text-2xl",        px: "24px" },
                  { token: "3xl",  cls: "text-3xl",        px: "30px" },
                  { token: "4xl",  cls: "text-4xl",        px: "36px" },
                  { token: "5xl",  cls: "text-5xl",        px: "48px" },
                  { token: "6xl",  cls: "text-6xl",        px: "60px" },
                  { token: "7xl",  cls: "text-7xl",        px: "72px" },
                  { token: "8xl",  cls: "text-8xl",        px: "96px" },
                ].map(({ token, cls, px }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <code className="text-[10px] text-muted-foreground w-32 shrink-0">
                      font-size-{token} · {px}
                    </code>
                    <p className={`${cls} leading-none`}>Minka</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Font weights */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Font weights</h2>
              <div className="space-y-3">
                {[
                  { token: "font-weight-400", cls: "font-normal", label: "400 — Regular" },
                  { token: "font-weight-500", cls: "font-medium", label: "500 — Medium" },
                  { token: "font-weight-600", cls: "font-bold",   label: "600 — SemiBold" },
                  { token: "font-style-italic",    cls: "italic",      label: "Italic — pairs with any weight" },
                ].map(({ token, cls, label }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <code className="text-[10px] text-muted-foreground w-44 shrink-0">{token}</code>
                    <p className={`text-2xl ${cls}`}>{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Line heights */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Line heights</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {[
                  { token: "none",    cls: "leading-none",    value: "1",     sample: "Single line headings and labels stay compact" },
                  { token: "tight",   cls: "leading-tight",   value: "1.25",  sample: "Large display text and hero sections feel natural" },
                  { token: "snug",    cls: "leading-snug",    value: "1.375", sample: "Subheadings sit comfortably between tight and normal" },
                  { token: "normal",  cls: "leading-normal",  value: "1.5",   sample: "Default body text is readable at this line height" },
                  { token: "relaxed", cls: "leading-relaxed", value: "1.625", sample: "Long form paragraphs breathe with a relaxed setting" },
                  { token: "loose",   cls: "leading-loose",   value: "1.75",  sample: "Editorial and very readable body copy feels open" },
                ].map(({ token, cls, value, sample }) => (
                  <div key={token} className="space-y-1">
                    <code className="text-[10px] text-muted-foreground">line-height-{token} · {value}</code>
                    <p className={`text-sm ${cls} text-foreground`}>{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Text styles */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Text styles</h2>
              <p className="text-sm text-muted-foreground">
                Semantic classes — the CSS equivalent of Figma text styles.
              </p>
              <div className="space-y-6">
                {[
                  { cls: "text-display",      label: "display",       meta: "7xl · bold · tight · tracking-tight" },
                  { cls: "text-heading-1",    label: "heading-1",     meta: "4xl · bold · tight · tracking-tight" },
                  { cls: "text-heading-2",    label: "heading-2",     meta: "3xl · bold · snug · tracking-tight" },
                  { cls: "text-heading-3",    label: "heading-3",     meta: "2xl · bold · snug" },
                  { cls: "text-heading-4",    label: "heading-4",     meta: "xl · bold · snug" },
                  { cls: "text-paragraph-lg", label: "paragraph-lg",  meta: "lg · regular · loose" },
                  { cls: "text-paragraph",    label: "paragraph",     meta: "base · regular · relaxed" },
                  { cls: "text-paragraph-sm", label: "paragraph-sm",  meta: "sm · regular · relaxed" },
                  { cls: "text-body-lg",      label: "body-lg",       meta: "lg · regular · normal" },
                  { cls: "text-body",         label: "body",          meta: "base · regular · normal" },
                  { cls: "text-body-sm",      label: "body-sm",       meta: "sm · regular · normal" },
                  { cls: "text-label",        label: "label",         meta: "sm · bold · none" },
                  { cls: "text-label-sm",     label: "label-sm",      meta: "xs · bold · none" },
                  { cls: "text-caption",      label: "caption",       meta: "xs · regular · normal" },
                  { cls: "text-overline",     label: "overline",      meta: "2xs · bold · uppercase · wide" },
                ].map(({ cls, label, meta }) => (
                  <div key={cls} className="flex items-baseline gap-4">
                    <div className="w-48 shrink-0 space-y-0.5">
                      <code className="text-[10px] text-muted-foreground block">.{label}</code>
                      <span className="text-[10px] text-muted-foreground/60">{meta}</span>
                    </div>
                    <p className={cls}>The quick brown fox</p>
                  </div>
                ))}
                {/* Code — special case, shown inline */}
                <div className="flex items-baseline gap-4">
                  <div className="w-48 shrink-0 space-y-0.5">
                    <code className="text-[10px] text-muted-foreground block">.code</code>
                    <span className="text-[10px] text-muted-foreground/60">mono · regular · inherits size</span>
                  </div>
                  <p className="text-body">
                    Call <span className="text-code">getUserById()</span> to fetch the user.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Letter spacing */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Letter spacing</h2>
              <div className="space-y-4">
                {[
                  { token: "tight",  cls: "tracking-tighter", value: "-0.04em", sample: "Display & hero text" },
                  { token: "normal", cls: "tracking-normal",  value: "0em",     sample: "Body text default" },
                  { token: "wide",   cls: "tracking-widest",  value: "0.1em",   sample: "Uppercase labels and overlines" },
                ].map(({ token, cls, value, sample }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <code className="text-[10px] text-muted-foreground w-44 shrink-0">
                      letter-spacing-{token} · {value}
                    </code>
                    <p className={`text-xl ${cls}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </section>

          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Separator />
        <p className="text-xs text-muted-foreground text-center pb-8">
          minka-product-ui — token layer: <code>tokens/primitives.css</code> → <code>app/globals.css</code> → shadcn variables
        </p>
      </div>
    </div>
  )
}
