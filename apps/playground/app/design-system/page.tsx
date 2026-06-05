import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import { CalendarDemo } from "./calendar-demo"
import { FilterChipDemo } from "./filter-chip-demo"
import { FilterComboboxDemo } from "./filter-combobox-demo"
import { CodeBlock } from "./code-block"
import { SearchBarDemo } from "./search-bar-demo"
import { AlertDemo } from "./alert-demo"
import { CornerDownLeft, Command, ArrowBigUp, Option, ChevronDown, Plus, Search, Mail } from "lucide-react"
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
import { StatCardActionsDemo } from "./stat-card-demo"
import { PasswordInputDemo } from "./password-input-demo"
import { ComboboxDemo } from "./combobox-demo"
import { SonnerDemo } from "./sonner-demo"
import { TooltipDemo } from "./tooltip-demo"
import { StatCard, TabCount, Avatar } from "minka-ds"
import { SwitchDemo } from "./switch-demo"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CellsDemo, TablePartsDemo } from "./depending-atoms-demo"
import { DateTimeRangeDemo } from "./datetime-range-demo"

function CatIntro({ children }: { children: React.ReactNode }) {
  return <p className="text-body-sm text-[var(--color-text-muted)] max-w-2xl">{children}</p>
}

export default function DesignSystemPlayground() {
  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
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
          <TabsContent value="components" className="pt-8">
            <Tabs defaultValue="atoms">
              <TabsList variant="line">
                <TabsTrigger value="atoms">Standalone atoms</TabsTrigger>
                <TabsTrigger value="depending">Depending atoms</TabsTrigger>
                <TabsTrigger value="molecules">Molecules</TabsTrigger>
                <TabsTrigger value="cellular">Cellular beings</TabsTrigger>
                <TabsTrigger value="thoughtful">Thoughtful beings</TabsTrigger>
              </TabsList>

              {/* ═══ Standalone atoms ═══ */}
              <TabsContent value="atoms" className="space-y-12 pt-8">
                <CatIntro>Self-sufficient components — drop them in anywhere, no parent or sibling required.</CatIntro>

                {/* Button */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Button</h2>
                  <div className="rounded-lg border border-[var(--color-border-default)] divide-y divide-[var(--color-border-subtle)]">
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
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Size</span>
                      <div className="flex flex-wrap gap-2 items-end">
                        <Button size="xs">XSmall</Button>
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Icon only</span>
                      <div className="flex flex-wrap gap-2 items-end">
                        <Button size="icon-xs" aria-label="icon-xs"><Plus /></Button>
                        <Button size="icon-sm" aria-label="icon-sm"><Plus /></Button>
                        <Button size="icon" aria-label="icon"><Plus /></Button>
                        <Button size="icon-lg" aria-label="icon-lg"><Plus /></Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">With icon</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button><Plus /> Create</Button>
                        <Button>Export <ChevronDown /></Button>
                        <Button variant="secondary"><Plus /> Create</Button>
                        <Button variant="outline">Export <ChevronDown /></Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="text-caption text-[var(--color-text-muted)] w-20 shrink-0">Disabled</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button disabled>Default</Button>
                        <Button variant="secondary" disabled>Secondary</Button>
                        <Button variant="outline" disabled>Outline</Button>
                        <Button variant="ghost" disabled>Ghost</Button>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Badge */}
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

                {/* Input */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Input</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="f-default">Default</Label>
                      <Input id="f-default" placeholder="Enter text…" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-filled">Filled</Label>
                      <Input id="f-filled" defaultValue="Andy Corredor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-disabled">Disabled</Label>
                      <Input id="f-disabled" placeholder="Disabled" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-disabled-filled">Disabled filled</Label>
                      <Input id="f-disabled-filled" defaultValue="Read-only value" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-error">Error</Label>
                      <Input id="f-error" defaultValue="invalid@" aria-invalid="true" />
                      <p className="text-caption text-[var(--color-feedback-error)]">Invalid email address</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-error-empty">Error empty</Label>
                      <Input id="f-error-empty" placeholder="Required field" aria-invalid="true" />
                      <p className="text-caption text-[var(--color-feedback-error)]">This field is required</p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Textarea */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Textarea</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ta-default">Default</Label>
                      <Textarea id="ta-default" placeholder="Enter description…" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ta-disabled">Disabled</Label>
                      <Textarea id="ta-disabled" placeholder="Disabled" rows={3} disabled />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="ta-error">Error</Label>
                      <Textarea id="ta-error" defaultValue="Too short" rows={3} aria-invalid="true" />
                      <p className="text-caption text-[var(--color-feedback-error)]">Minimum 20 characters required</p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Switch */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Switch</h2>
                  <SwitchDemo />
                </section>

                <Separator />

                {/* Skeleton */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Skeleton</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Skeleton className="h-24 rounded-lg" />
                      <Skeleton className="h-24 rounded-lg" />
                      <Skeleton className="h-24 rounded-lg" />
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Separator */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Separator</h2>
                  <div className="space-y-3">
                    <p className="text-body-sm text-[var(--color-text-muted)]">Horizontal</p>
                    <Separator />
                    <div className="flex items-center gap-3 h-8">
                      <span className="text-body-sm">Left</span>
                      <Separator orientation="vertical" />
                      <span className="text-body-sm">Right</span>
                    </div>
                  </div>
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

                {/* Alert */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Alert</h2>
                  <AlertDemo />
                </section>

                <Separator />

                {/* Avatar */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Avatar</h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Avatar name="Andy Corredor" size="sm" />
                      <Avatar name="Andy Corredor" size="md" />
                      <Avatar name="Andy Corredor" size="lg" />
                    </div>
                    <span className="text-caption text-[var(--color-text-hint)]">initials · sizes sm / md / lg</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar name="María García" background="var(--color-brand-darkforest)" />
                    <Avatar name="Carlos Méndez" background="var(--color-brand-bronze)" />
                    <Avatar name="Diana Restrepo" background="var(--color-brand-navy)" />
                    <Avatar name="Felipe Ríos" background="var(--color-brand-coral)" />
                    <span className="text-caption text-[var(--color-text-hint)]">brand backgrounds</span>
                  </div>
                </section>

                <Separator />

                {/* Calendar */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Calendar</h2>
                  <CalendarDemo />
                </section>
              </TabsContent>

              {/* ═══ Depending atoms (audit grid) ═══ */}
              <TabsContent value="depending" className="space-y-6 pt-8">
                <CatIntro>Building blocks that only exist inside a parent. Each is demonstrated live within its parent (Molecules / Cellular tabs) — this is the full inventory for auditing.</CatIntro>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-caption text-[var(--color-text-muted)]">
                  <div><span className="text-[var(--color-text-default)]">Cells (cross-cutting):</span> TextStack · DataCell · AmountCell · BadgeCell · ActionCell · StatusCell</div>
                  <div><span className="text-[var(--color-text-default)]">Table:</span> Header · Body · Footer · Row · Head · Cell · Caption</div>
                  <div><span className="text-[var(--color-text-default)]">Tabs:</span> List · Trigger · Content · TabCount</div>
                  <div><span className="text-[var(--color-text-default)]">Breadcrumb:</span> List · Item · Link · Page · Separator · Ellipsis</div>
                  <div><span className="text-[var(--color-text-default)]">Pagination:</span> Content · Item · Link · Previous · Next · Ellipsis</div>
                  <div><span className="text-[var(--color-text-default)]">Select:</span> Trigger · Value · Content · Item · Group · Label · Separator</div>
                  <div><span className="text-[var(--color-text-default)]">Card:</span> Header · Title · Description · Action · Content · Footer</div>
                  <div><span className="text-[var(--color-text-default)]">InputGroup:</span> Addon · Button · Text · Input · Textarea</div>
                  <div><span className="text-[var(--color-text-default)]">ButtonGroup:</span> Text · Separator</div>
                  <div><span className="text-[var(--color-text-default)]">Tooltip:</span> Provider · Trigger · Content · Label · Description</div>
                  <div><span className="text-[var(--color-text-default)]">Collapsible:</span> Trigger · Content</div>
                  <div><span className="text-[var(--color-text-default)]">Dialog:</span> Trigger · Content · Header · Title · Description · Footer · Close</div>
                  <div><span className="text-[var(--color-text-default)]">Sheet:</span> Trigger · Content · Header · Title · Description · Footer · Close</div>
                  <div><span className="text-[var(--color-text-default)]">DropdownMenu:</span> Trigger · Content · Item · CheckboxItem · RadioItem · Label · Separator · Sub…</div>
                  <div className="sm:col-span-2"><span className="text-[var(--color-text-default)]">Sidebar:</span> Provider · Trigger · Content · Header · Footer · Inset · Rail · Group(+Action/Content/Label) · Menu(+Item/Button/Action/Badge/Skeleton/Sub…)</div>
                </div>
              </TabsContent>

              {/* ═══ Molecules ═══ */}
              <TabsContent value="molecules" className="space-y-12 pt-8">
                <CatIntro>Components that compose atoms into a single, moderately complex unit.</CatIntro>

                {/* Card */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Card</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Card · CardHeader · CardTitle · CardDescription · CardAction · CardContent · CardFooter</p>
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

                {/* Select */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Select</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Select · SelectTrigger · SelectValue · SelectContent · SelectGroup · SelectLabel · SelectItem · SelectSeparator</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="s-default">Default</Label>
                      <Select>
                        <SelectTrigger id="s-default"><SelectValue placeholder="Select an option" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="p2p">P2P</SelectItem>
                            <SelectItem value="p2m">P2M</SelectItem>
                            <SelectItem value="b2p">B2P</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-disabled">Disabled</Label>
                      <Select disabled>
                        <SelectTrigger id="s-disabled"><SelectValue placeholder="Disabled" /></SelectTrigger>
                        <SelectContent />
                      </Select>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Tabs */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Tabs</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Tabs · TabsList · TabsTrigger · TabsContent · TabCount</p>
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
                    <div className="space-y-2">
                      <p className="text-caption text-[var(--color-text-muted)]">With TabCount</p>
                      <Tabs defaultValue="all">
                        <TabsList variant="line">
                          <TabsTrigger value="all">All <TabCount count={300} /></TabsTrigger>
                          <TabsTrigger value="completed">Completed <TabCount count={205} /></TabsTrigger>
                          <TabsTrigger value="pending">Pending <TabCount count={58} /></TabsTrigger>
                          <TabsTrigger value="failed">Failed <TabCount count={23} /></TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Breadcrumb */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Breadcrumb</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Breadcrumb · BreadcrumbList · BreadcrumbItem · BreadcrumbLink · BreadcrumbPage · BreadcrumbSeparator · BreadcrumbEllipsis</p>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem><BreadcrumbLink href="#">Transactions</BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbLink href="#">List</BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbPage>MOL-9282-542F-F3C2</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </section>

                <Separator />

                {/* Pagination */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Pagination</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Pagination · PaginationContent · PaginationItem · PaginationLink · PaginationPrevious · PaginationNext · PaginationEllipsis</p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                      <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationEllipsis /></PaginationItem>
                      <PaginationItem><PaginationLink href="#">8</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationNext href="#" /></PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </section>

                <Separator />

                {/* Tooltip */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Tooltip</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: TooltipProvider · Tooltip · TooltipTrigger · TooltipContent · TooltipLabel · TooltipDescription</p>
                  <TooltipDemo />
                </section>

                <Separator />

                {/* Input Group */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Input Group</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: InputGroup · InputGroupAddon · InputGroupButton · InputGroupText · InputGroupInput · InputGroupTextarea</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-caption text-[var(--color-text-muted)]">With icon addon</p>
                      <InputGroup>
                        <InputGroupAddon><Search className="size-4 text-[var(--color-text-hint)]" /></InputGroupAddon>
                        <InputGroupInput placeholder="Search…" />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <p className="text-caption text-[var(--color-text-muted)]">With text addon</p>
                      <InputGroup>
                        <InputGroupText>$</InputGroupText>
                        <InputGroupInput placeholder="0.00" />
                        <InputGroupText>COP</InputGroupText>
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <p className="text-caption text-[var(--color-text-muted)]">With trailing icon</p>
                      <InputGroup>
                        <InputGroupAddon><Mail className="size-4 text-[var(--color-text-hint)]" /></InputGroupAddon>
                        <InputGroupInput placeholder="you@company.com" />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <p className="text-caption text-[var(--color-text-muted)]">Password with toggle</p>
                      <PasswordInputDemo />
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Button Group */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Button Group</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: ButtonGroup · ButtonGroupText · ButtonGroupSeparator</p>
                  <div className="flex flex-wrap gap-4">
                    <ButtonGroup>
                      <ButtonGroupText>Sort by</ButtonGroupText>
                      <ButtonGroupSeparator />
                      <ButtonGroupText>Date</ButtonGroupText>
                    </ButtonGroup>
                    <ButtonGroup>
                      <ButtonGroupText>Filter</ButtonGroupText>
                      <ButtonGroupSeparator />
                      <ButtonGroupText>All statuses</ButtonGroupText>
                      <ButtonGroupSeparator />
                      <ButtonGroupText><Plus className="size-3.5" /></ButtonGroupText>
                    </ButtonGroup>
                  </div>
                </section>

                <Separator />

                {/* Collapsible */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Collapsible</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Collapsible · CollapsibleTrigger · CollapsibleContent</p>
                  <Collapsible className="w-80 space-y-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Advanced filters <ChevronDown className="size-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 px-1">
                      <p className="text-body-sm text-[var(--color-text-muted)]">Filter by date range</p>
                      <p className="text-body-sm text-[var(--color-text-muted)]">Filter by participant</p>
                      <p className="text-body-sm text-[var(--color-text-muted)]">Filter by amount</p>
                    </CollapsibleContent>
                  </Collapsible>
                </section>

                <Separator />

                {/* Filter Chip */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Filter Chip</h2>
                  <FilterChipDemo />
                </section>

                <Separator />

                {/* Dropdown Menu */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Dropdown Menu</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: DropdownMenu · Trigger · Content · Item · CheckboxItem · RadioItem · Label · Separator · Sub(Trigger/Content)</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open menu <ChevronDown className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-[var(--color-feedback-error)]">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </section>

                <Separator />

                {/* Stat Card */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Stat Card</h2>
                  <div className="space-y-4">
                    <p className="text-caption text-[var(--color-text-muted)]">Count</p>
                    <div className="grid grid-cols-4 gap-3">
                      <StatCard label="Completed" value={205} percent={68} color="success" dot="var(--color-feedback-success)" />
                      <StatCard label="Pending"   value={58}  percent={19} color="default" dot="var(--color-feedback-warning)" />
                      <StatCard label="Rejected"  value={14}  percent={5}  color="default" dot="rgb(71 85 105)" />
                      <StatCard label="Failed"    value={23}  percent={8}  color="error"   dot="var(--color-feedback-error)" />
                    </div>
                    <p className="text-caption text-[var(--color-text-muted)]">Amount</p>
                    <div className="grid grid-cols-4 gap-3">
                      <StatCard type="amount" label="Total moved" value="$254.7M" subvalue="$848K avg / trx" />
                      <StatCard type="amount" label="P2P" value="$72.0M" percent={28} subvalue="$910K avg / trx" />
                      <StatCard type="amount" label="P2M" value="$89.4M" percent={35} subvalue="$780K avg / trx" color="success" />
                      <StatCard type="amount" label="Alert threshold" value={null} unit="COP" />
                    </div>
                    <p className="text-caption text-[var(--color-text-muted)]">Status</p>
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard type="status" label="Settlement" status="Active"        color="success" />
                      <StatCard type="status" label="Settlement" status="Balance alert" color="error"   />
                      <StatCard type="status" label="Settlement" status="Inactive"      color="muted"   />
                    </div>
                    <p className="text-caption text-[var(--color-text-muted)]">With actions</p>
                    <StatCardActionsDemo />
                  </div>
                </section>
              </TabsContent>

              {/* ═══ Cellular beings ═══ */}
              <TabsContent value="cellular" className="space-y-12 pt-8">
                <CatIntro>Composed of multiple molecules and atoms — full interface regions.</CatIntro>

                {/* Data Table */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Data Table</h2>
                  <DataTableDemo />
                </section>

                <Separator />

                {/* Cells — depending atoms, shown in their canonical context */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Cells</h2>
                  <p className="text-caption text-[var(--color-text-muted)]">Depending atoms — TextStack · DataCell · AmountCell · BadgeCell · ActionCell · StatusCell, composed inside table rows.</p>
                  <CellsDemo />
                </section>

                <Separator />

                {/* Table parts */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Table parts</h2>
                  <p className="text-caption text-[var(--color-text-muted)]">Depending atoms — Table · TableHeader · TableBody · TableRow · TableHead · TableCell.</p>
                  <TablePartsDemo />
                </section>

                <Separator />

                {/* Search Bar */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Search Bar</h2>
                  <SearchBarDemo />
                </section>

                <Separator />

                {/* Filter Combobox */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Filter Combobox</h2>
                  <FilterComboboxDemo />
                </section>

                <Separator />

                {/* Combobox */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Combobox</h2>
                  <ComboboxDemo />
                </section>

                <Separator />

                {/* DateTime Range Picker */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">DateTime Range Picker</h2>
                  <DateTimeRangeDemo />
                </section>

                <Separator />

                {/* Dialog */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Dialog</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: Dialog · DialogTrigger · DialogContent · DialogHeader · DialogTitle · DialogDescription · DialogFooter · DialogClose</p>
                  <DialogDemo />
                </section>

                <Separator />

                {/* Toast */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Toast</h2>
                  <SonnerDemo />
                </section>

                <Separator />

                {/* Sidebar */}
                <section className="space-y-3">
                  <h2 className="text-label text-[var(--color-text-muted)] uppercase tracking-widest">Sidebar</h2>
                  <p className="text-caption text-[var(--color-text-hint)]">Anatomy: SidebarProvider · Sidebar · Trigger · Content · Header · Footer · Inset · Group(+Content/Label) · Menu(+Item/Button/Sub…)</p>
                  <SidebarDemo />
                </section>
              </TabsContent>

              {/* ═══ Thoughtful beings ═══ */}
              <TabsContent value="thoughtful" className="pt-8">
                <div className="rounded-lg border border-dashed border-[var(--color-border-default)] px-8 py-16 text-center space-y-2">
                  <p className="text-heading-4-serif text-[var(--color-text-default)]">Thoughtful beings</p>
                  <p className="text-body-sm text-[var(--color-text-muted)] max-w-md mx-auto">
                    UX patterns, layouts, and flows that define how screens and journeys behave — coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* ── Tokens tab ─────────────────────────────────────── */}
          <TabsContent value="tokens" className="space-y-10 pt-6">

            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Color primitives</h2>
              {[
                { name: "neutral",    steps: ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "1000"] },
                { name: "beige",      steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "red",        steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "bronze",     steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "yellow",     steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "lulo",       steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "green",      steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "aquamarine", steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "sea",        steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
                { name: "slate",      steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
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

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Brand colors</h2>
              <div className="flex gap-3 flex-wrap">
                {[
                  ["beige",  "--color-brand-beige"],
                  ["yellow", "--color-brand-yellow"],
                  ["rose",   "--color-brand-rose"],
                  ["coral",  "--color-brand-coral"],
                  ["blue",   "--color-brand-blue"],
                  ["darkforest", "--color-brand-darkforest"],
                  ["navy",   "--color-brand-navy"],
                  ["bronze", "--color-brand-bronze"],
                ].map(([label, token]) => (
                  <div key={token} className="flex flex-col items-center gap-1.5">
                    <div className="w-16 h-12 rounded-md border border-[var(--color-border-default)]" style={{ backgroundColor: `var(${token})` }} />
                    <code className="text-caption text-[var(--color-text-muted)]">{label}</code>
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
                    <p className={`text-base leading-normal ${cls}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Text styles</h2>
              <div className="space-y-10">
                {([
                  { category: "Display", styles: [
                    { cls: "text-display", label: "display", meta: "7xl · 600 · tight", sample: "The quick brown fox" },
                  ]},
                  { category: "Heading — sans", styles: [
                    { cls: "text-heading-1", label: "heading-1", meta: "4xl · 600 · tight", sample: "The quick brown fox" },
                    { cls: "text-heading-2", label: "heading-2", meta: "3xl · 600 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-3", label: "heading-3", meta: "2xl · 600 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-4", label: "heading-4", meta: "xl · 600 · snug",   sample: "The quick brown fox" },
                  ]},
                  { category: "Heading — serif", styles: [
                    { cls: "text-heading-1-serif",    label: "heading-1-serif",    meta: "4xl · 400 · tight", sample: "The quick brown fox" },
                    { cls: "text-heading-2-serif",    label: "heading-2-serif",    meta: "3xl · 400 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-3-serif",    label: "heading-3-serif",    meta: "2xl · 400 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-4-serif",    label: "heading-4-serif",    meta: "xl · 400 · snug",   sample: "The quick brown fox" },
                  ]},
                  { category: "Heading — serif lg", styles: [
                    { cls: "text-heading-1-lg-serif", label: "heading-1-lg-serif", meta: "5xl · 400 · tight", sample: "The quick brown fox" },
                    { cls: "text-heading-2-lg-serif", label: "heading-2-lg-serif", meta: "4xl · 400 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-3-lg-serif", label: "heading-3-lg-serif", meta: "3xl · 400 · snug",  sample: "The quick brown fox" },
                    { cls: "text-heading-4-lg-serif", label: "heading-4-lg-serif", meta: "2xl · 400 · snug",  sample: "The quick brown fox" },
                  ]},
                  { category: "Paragraph", styles: [
                    { cls: "text-paragraph-lg", label: "paragraph-lg", meta: "lg · 500 · loose",   sample: "The quick brown fox jumps over the lazy dog" },
                    { cls: "text-paragraph",    label: "paragraph",    meta: "base · 500 · relaxed",sample: "The quick brown fox jumps over the lazy dog" },
                    { cls: "text-paragraph-sm", label: "paragraph-sm", meta: "sm · 500 · relaxed", sample: "The quick brown fox jumps over the lazy dog" },
                  ]},
                  { category: "Body — sans", styles: [
                    { cls: "text-body-lg",       label: "body-lg",       meta: "lg · 500 · normal",  sample: "The quick brown fox" },
                    { cls: "text-body-lg-light", label: "body-lg-light", meta: "lg · 400 · normal",  sample: "The quick brown fox" },
                    { cls: "text-body",          label: "body",          meta: "base · 500 · normal",sample: "The quick brown fox" },
                    { cls: "text-body-light",    label: "body-light",    meta: "base · 400 · normal",sample: "The quick brown fox" },
                    { cls: "text-body-sm",       label: "body-sm",       meta: "sm · 500 · normal",  sample: "The quick brown fox" },
                    { cls: "text-body-sm-light", label: "body-sm-light", meta: "sm · 400 · normal",  sample: "The quick brown fox" },
                  ]},
                  { category: "Body — serif", styles: [
                    { cls: "text-body-xl-serif",    label: "body-xl-serif",    meta: "xl · 400 · normal",   sample: "The quick brown fox" },
                    { cls: "text-body-lg-serif",    label: "body-lg-serif",    meta: "lg · 400 · normal",   sample: "The quick brown fox" },
                    { cls: "text-body-serif",       label: "body-serif",       meta: "base · 400 · normal", sample: "The quick brown fox" },
                    { cls: "text-body-sm-lg-serif", label: "body-sm-lg-serif", meta: "base · 400 · normal", sample: "The quick brown fox" },
                    { cls: "text-body-sm-serif",    label: "body-sm-serif",    meta: "sm · 400 · normal",   sample: "The quick brown fox" },
                  ]},
                  { category: "Label", styles: [
                    { cls: "text-label",    label: "label",    meta: "sm · 600 · none", sample: "Status label" },
                    { cls: "text-label-sm", label: "label-sm", meta: "xs · 600 · none", sample: "Status label" },
                  ]},
                  { category: "Caption — sans", styles: [
                    { cls: "text-caption",         label: "caption",          meta: "xs · 500 · normal",  sample: "Helper text and metadata" },
                    { cls: "text-caption-light",   label: "caption-light",    meta: "xs · 400 · normal",  sample: "Helper text and metadata" },
                    { cls: "text-caption-sm",      label: "caption-sm",       meta: "2xs · 500 · normal", sample: "Helper text and metadata" },
                    { cls: "text-caption-sm-light",label: "caption-sm-light", meta: "2xs · 400 · normal", sample: "Helper text and metadata" },
                  ]},
                  { category: "Caption — serif", styles: [
                    { cls: "text-caption-lg-serif",   label: "caption-lg-serif",    meta: "sm · 400 · normal",  sample: "Helper text and metadata" },
                    { cls: "text-caption-serif",      label: "caption-serif",       meta: "xs · 400 · normal",  sample: "Helper text and metadata" },
                    { cls: "text-caption-sm-lg-serif",label: "caption-sm-lg-serif", meta: "xs · 400 · normal",  sample: "Helper text and metadata" },
                    { cls: "text-caption-sm-serif",   label: "caption-sm-serif",    meta: "2xs · 400 · normal", sample: "Helper text and metadata" },
                  ]},
                  { category: "Overline", styles: [
                    { cls: "text-overline", label: "overline", meta: "2xs · 600 · wide · uppercase", sample: "Section header" },
                  ]},
                  { category: "Code", styles: [
                    { cls: "text-code", label: "code", meta: "mono · 400 · bg", sample: "tokens.primitive['font-mono']" },
                  ]},
                ] as { category: string; styles: { cls: string; label: string; meta: string; sample: string }[] }[]).map(({ category, styles }) => (
                  <div key={category} className="space-y-3">
                    <p className="text-caption-sm text-[var(--color-text-hint)] uppercase tracking-wide">{category}</p>
                    <div className="space-y-4">
                      {styles.map(({ cls, label, meta, sample }) => (
                        <div key={cls} className="flex items-baseline gap-4">
                          <div className="w-52 shrink-0 space-y-0.5">
                            <code className="text-caption text-[var(--color-text-muted)] block">.{label}</code>
                            <span className="text-caption-sm text-[var(--color-text-hint)]">{meta}</span>
                          </div>
                          <p className={cls}>{sample}</p>
                        </div>
                      ))}
                    </div>
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
