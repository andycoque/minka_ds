import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import { CalendarDemo } from "./calendar-demo"
import { FilterChipDemo } from "./filter-chip-demo"
import { FilterComboboxDemo } from "./filter-combobox-demo"
import { CodeBlock } from "./code-block"
import { SearchBarDemo } from "./search-bar-demo"
import { AlertDemo } from "./alert-demo"
import { CornerDownLeft, Command, ArrowBigUp, Option } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { SidebarDemo } from "./sidebar-demo"
import { DataTableDemo } from "./data-table-demo"
import { DialogDemo } from "./dialog-demo"
import { SheetDemo } from "./sheet-demo"
import { ComboboxDemo } from "./combobox-demo"

export default function DesignSystemPlayground() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-16">

        {/* Header */}
        <div className="space-y-2">
          <div className="space-y-1">
            <h1 className="text-heading-1">Design System</h1>
            <p className="text-body text-[var(--color-text-muted)]">
              minka-product-ui — component playground & token reference
            </p>
          </div>
          <div className="space-y-2">
            <CodeBlock code="npm install minka-ds" />
            <CodeBlock code="import { Button, SearchBar, FilterCombobox } from 'minka-ds'" />
            <CodeBlock code="import 'minka-ds/tokens/primitives.css'" />
          </div>
        </div>

        <Tabs defaultValue="components">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          {/* ── Components tab ─────────────────────────────────── */}
          <TabsContent value="components" className="space-y-12 pt-8">

            {/* Buttons */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Button</h2>
              <div className="rounded-lg border border-[var(--color-border-default)] divide-y divide-[var(--color-border-subtle)]">
                {/* Variants */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Variant</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                {/* Sizes */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Size</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" aria-label="icon">+</Button>
                    <Button size="icon-sm" aria-label="icon-sm">+</Button>
                  </div>
                </div>
                {/* States */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">State</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button disabled>Disabled</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                    <Button variant="outline" disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Badges */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Badge</h2>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge>Default</Badge>
                <Badge variant="filled">Filled</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </div>
            </section>

            <Separator />

            {/* Calendar */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Calendar</h2>
              <CalendarDemo />
            </section>

            <Separator />

            {/* FilterChip */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Filter Chip</h2>
              <FilterChipDemo />
            </section>

            <Separator />

            {/* FilterCombobox */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Filter Combobox</h2>
              <FilterComboboxDemo />
            </section>

            <Separator />

            {/* SearchBar */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Search Bar</h2>
              <SearchBarDemo />
            </section>

            <Separator />

            {/* Alert */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Alert</h2>
              <AlertDemo />
            </section>

            <Separator />

            {/* Kbd */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Kbd</h2>
              <div className="rounded-lg border border-[var(--color-border-default)] divide-y divide-[var(--color-border-subtle)]">
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Mac</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Kbd><CornerDownLeft className="size-3" /></Kbd>
                    <Kbd><CornerDownLeft className="size-3" /> open</Kbd>
                    <Kbd><Command className="size-3" /> K</Kbd>
                    <Kbd><ArrowBigUp className="size-3" /> <Command className="size-3" /> P</Kbd>
                    <Kbd><Option className="size-3" /></Kbd>
                    <Kbd>Esc</Kbd>
                  </div>
                </div>
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Windows</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Kbd><CornerDownLeft className="size-3" /></Kbd>
                    <Kbd><CornerDownLeft className="size-3" /> open</Kbd>
                    <Kbd>Ctrl K</Kbd>
                    <Kbd><ArrowBigUp className="size-3" /> Ctrl P</Kbd>
                    <Kbd><Option className="size-3" /></Kbd>
                    <Kbd>Esc</Kbd>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Form */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Form</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="example-input">Input</Label>
                  <Input id="example-input" placeholder="Enter text…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="example-input-disabled">Disabled</Label>
                  <Input id="example-input-disabled" placeholder="Disabled" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="example-select">Select</Label>
                  <Select>
                    <SelectTrigger id="example-select">
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
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="example-textarea">Textarea</Label>
                  <Textarea id="example-textarea" placeholder="Enter longer text…" rows={3} />
                </div>
              </div>
            </section>

            <Separator />

            {/* Combobox */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Combobox</h2>
              <ComboboxDemo />
            </section>

            <Separator />

            {/* Cards */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Card</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Supporting description text below the title.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-[var(--color-text-muted)]">
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

            {/* Tabs */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Tabs</h2>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-caption text-[var(--color-text-muted)]">Default</p>
                  <Tabs defaultValue="t1">
                    <TabsList>
                      <TabsTrigger value="t1">Overview</TabsTrigger>
                      <TabsTrigger value="t2">Activity</TabsTrigger>
                      <TabsTrigger value="t3">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="t1"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Overview content.</p></TabsContent>
                    <TabsContent value="t2"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Activity content.</p></TabsContent>
                    <TabsContent value="t3"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Settings content.</p></TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <p className="text-caption text-[var(--color-text-muted)]">Line variant</p>
                  <Tabs defaultValue="t1">
                    <TabsList variant="line">
                      <TabsTrigger value="t1">Overview</TabsTrigger>
                      <TabsTrigger value="t2">Activity</TabsTrigger>
                      <TabsTrigger value="t3">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="t1"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Overview content.</p></TabsContent>
                    <TabsContent value="t2"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Activity content.</p></TabsContent>
                    <TabsContent value="t3"><p className="text-body-sm pt-3 text-[var(--color-text-muted)]">Settings content.</p></TabsContent>
                  </Tabs>
                </div>
              </div>
            </section>

            <Separator />

            {/* Data Table */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Data Table</h2>
              <DataTableDemo />
            </section>

            <Separator />

            {/* Dialog */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Dialog</h2>
              <DialogDemo />
            </section>

            <Separator />

            {/* Sheet */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Sheet</h2>
              <SheetDemo />
            </section>

            <Separator />

            {/* Sidebar */}
            <section className="space-y-3">
              <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Sidebar</h2>
              <SidebarDemo />
            </section>

          </TabsContent>

          {/* ── Tokens tab ─────────────────────────────────────── */}
          <TabsContent value="tokens" className="space-y-10 pt-6">

            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Color primitives</h2>
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
                  <span className="text-caption text-[var(--color-text-muted)] w-24 shrink-0 capitalize">{name}</span>
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

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Text tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["text-default",  "--color-text-default"],
                  ["text-muted",    "--color-text-muted"],
                  ["text-hint",     "--color-text-hint"],
                  ["text-disabled", "--color-text-disabled"],
                  ["text-inverse",  "--color-text-inverse"],
                  ["text-link",     "--color-text-link"],
                  ["text-success",  "--color-text-success"],
                  ["text-error",    "--color-text-error"],
                  ["text-warning",  "--color-text-warning"],
                  ["text-info",     "--color-text-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <span className="text-body-sm font-medium shrink-0" style={{ color: `var(${token})` }}>Aa</span>
                    <code className="text-caption text-[var(--color-text-muted)] truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Background tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["bg-canvas",   "--color-bg-canvas"],
                  ["bg-base",     "--color-bg-base"],
                  ["bg-raised",   "--color-bg-raised"],
                  ["bg-overlay",  "--color-bg-overlay"],
                  ["bg-inverted", "--color-bg-inverted"],
                  ["bg-disabled", "--color-bg-disabled"],
                  ["bg-success",  "--color-bg-success"],
                  ["bg-error",    "--color-bg-error"],
                  ["bg-warning",  "--color-bg-warning"],
                  ["bg-info",     "--color-bg-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded shrink-0 border border-[var(--color-border-default)]" style={{ backgroundColor: `var(${token})` }} />
                    <code className="text-caption text-[var(--color-text-muted)] truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Border tokens</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["border-subtle",   "--color-border-subtle"],
                  ["border-default",  "--color-border-default"],
                  ["border-strong",   "--color-border-strong"],
                  ["border-focus",    "--color-border-focus"],
                  ["border-success",  "--color-border-success"],
                  ["border-error",    "--color-border-error"],
                  ["border-warning",  "--color-border-warning"],
                  ["border-info",     "--color-border-info"],
                ].map(([label, token]) => (
                  <div key={token} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded shrink-0" style={{ border: `2px solid var(${token})` }} />
                    <code className="text-caption text-[var(--color-text-muted)] truncate">{label}</code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Action tokens</h2>
              {["primary", "secondary", "ghost", "destructive"].map((variant) => (
                <div key={variant} className="space-y-2">
                  <p className="text-body-sm font-medium capitalize">{variant}</p>
                  <div className="flex gap-3 flex-wrap">
                    {["default", "hover", "pressed", "disabled"].map((state) => (
                      <div key={state} className="flex flex-col items-center gap-1">
                        <div
                          className="w-16 h-8 rounded flex items-center justify-center border border-[var(--color-border-subtle)]"
                          style={{
                            backgroundColor: `var(--color-action-${variant}-${state})`,
                            color: state === "disabled" ? "var(--color-text-disabled)" : `var(--color-action-${variant}-foreground)`,
                          }}
                        >
                          <span className="text-caption-sm font-medium">Aa</span>
                        </div>
                        <code className="text-caption-sm text-[var(--color-text-muted)]">{state}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <Separator />

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
                    <div className="w-12 h-12 bg-[var(--color-action-primary-default)]" style={{ borderRadius: `var(${token})` }} />
                    <span className="text-caption text-[var(--color-text-muted)]">{label}</span>
                  </div>
                ))}
              </div>
            </section>

          </TabsContent>

          {/* ── Typography tab ─────────────────────────────────── */}
          <TabsContent value="typography" className="space-y-12 pt-6">

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Font families</h2>
              <div className="space-y-3">
                {[
                  { token: "--font-sans",    cls: "font-sans",    sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-serif",   cls: "font-serif",   sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-heading", cls: "font-heading", sample: "The quick brown fox jumps over the lazy dog" },
                  { token: "--font-mono",    cls: "font-mono",    sample: "const value = tokens.primitive['font-mono']" },
                ].map(({ token, cls, sample }) => (
                  <div key={token} className="flex items-baseline gap-4">
                    <code className="text-caption text-[var(--color-text-muted)] w-32 shrink-0">{token}</code>
                    <p className={`text-body ${cls}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Text styles</h2>
              <div className="space-y-6">
                {[
                  { cls: "text-display",        label: "display",        meta: "7xl · 600 · tight" },
                  { cls: "text-heading-1",       label: "heading-1",      meta: "4xl · 600 · tight" },
                  { cls: "text-heading-2",       label: "heading-2",      meta: "3xl · 600 · snug" },
                  { cls: "text-heading-3",       label: "heading-3",      meta: "2xl · 600 · snug" },
                  { cls: "text-heading-4",       label: "heading-4",      meta: "xl · 600 · snug" },
                  { cls: "text-paragraph-lg",    label: "paragraph-lg",   meta: "lg · 500 · loose" },
                  { cls: "text-paragraph",       label: "paragraph",      meta: "base · 500 · relaxed" },
                  { cls: "text-paragraph-sm",    label: "paragraph-sm",   meta: "sm · 500 · relaxed" },
                  { cls: "text-body-lg",         label: "body-lg",        meta: "lg · 500 · normal" },
                  { cls: "text-body-lg-light",   label: "body-lg-light",  meta: "lg · 400 · normal" },
                  { cls: "text-body",            label: "body",           meta: "base · 500 · normal" },
                  { cls: "text-body-light",      label: "body-light",     meta: "base · 400 · normal" },
                  { cls: "text-body-sm",         label: "body-sm",        meta: "sm · 500 · normal" },
                  { cls: "text-body-sm-light",   label: "body-sm-light",  meta: "sm · 400 · normal" },
                  { cls: "text-label",           label: "label",          meta: "sm · 600 · none" },
                  { cls: "text-label-sm",        label: "label-sm",       meta: "xs · 600 · none" },
                  { cls: "text-caption",         label: "caption",        meta: "xs · 500 · normal" },
                  { cls: "text-caption-light",   label: "caption-light",  meta: "xs · 400 · normal" },
                  { cls: "text-caption-sm",      label: "caption-sm",     meta: "2xs · 500 · normal" },
                  { cls: "text-caption-sm-light",label: "caption-sm-light",meta: "2xs · 400 · normal" },
                  { cls: "text-overline",        label: "overline",       meta: "2xs · 600 · wide · uppercase" },
                ].map(({ cls, label, meta }) => (
                  <div key={cls} className="flex items-baseline gap-4">
                    <div className="w-48 shrink-0 space-y-0.5">
                      <code className="text-caption text-[var(--color-text-muted)] block">.{label}</code>
                      <span className="text-caption-sm text-[var(--color-text-hint)]">{meta}</span>
                    </div>
                    <p className={cls}>The quick brown fox</p>
                  </div>
                ))}
              </div>
            </section>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
