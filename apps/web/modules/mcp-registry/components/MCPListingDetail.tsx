import Link from 'next/link';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui/components/accordion';
import { Github, ExternalLink, Book, Download, Star, TrendingUp, Package } from 'lucide-react';
import type { MCPListingWithRelations } from '@repo/database';
import { CodeBlock } from './CodeBlock';

interface MCPListingDetailProps {
  listing: MCPListingWithRelations;
}

export function MCPListingDetail({ listing }: MCPListingDetailProps) {
  const tags = Array.isArray(listing.tags)
    ? listing.tags.map((t: any) => t.tag).filter(Boolean)
    : [];

  const codeExamples = Array.isArray(listing.code_examples) ? listing.code_examples : [];
  const faqs = Array.isArray(listing.faqs) ? listing.faqs : [];
  const useCases = Array.isArray(listing.use_cases) ? listing.use_cases : [];
  const screenshots = Array.isArray(listing.screenshots) ? listing.screenshots : [];
  const socialLinks = Array.isArray(listing.social_links) ? listing.social_links : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: listing.title,
            description: listing.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Cross-platform',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: listing.stars_count > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: '5',
              ratingCount: listing.stars_count,
            } : undefined,
          }),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/mcp" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Registry
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={listing.type === 'server' ? 'default' : 'secondary'}>
                  {listing.type}
                </Badge>
                {listing.verified && (
                  <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                    ✓ Verified
                  </Badge>
                )}
                {listing.featured && (
                  <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-3">{listing.title}</h1>

              {listing.tagline && (
                <p className="text-xl text-muted-foreground mb-4">{listing.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {listing.author_name && (
                  <span>By {listing.author_name}</span>
                )}
                {listing.stars_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{listing.stars_count.toLocaleString()} stars</span>
                  </div>
                )}
                {listing.view_count > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{listing.view_count.toLocaleString()} views</span>
                  </div>
                )}
                {listing.version && (
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>v{listing.version}</span>
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag: any) => (
                    <Link key={tag.id} href={`/mcp/tags/${tag.slug}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {codeExamples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Get started with these implementation examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={codeExamples[0]?.id}>
                    <TabsList className="w-full justify-start overflow-x-auto">
                      {codeExamples.map((example) => (
                        <TabsTrigger key={example.id} value={example.id}>
                          {example.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {codeExamples.map((example) => (
                      <TabsContent key={example.id} value={example.id} className="mt-4">
                        {example.description && (
                          <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                        )}
                        <CodeBlock code={example.code} language={example.language} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {useCases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                  <CardDescription>Real-world applications and scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {useCases.map((useCase) => (
                    <div key={useCase.id} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold mb-1">{useCase.title}</h3>
                      {useCase.industry && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {useCase.industry}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      {useCase.example && (
                        <p className="text-sm text-muted-foreground italic mt-2">Example: {useCase.example}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {faqs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map((faq) => ({
                          '@type': 'Question',
                          name: faq.question,
                          acceptedAnswer: {
                            '@type': 'Answer',
                            text: faq.answer,
                          },
                        })),
                      }),
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {listing.repository_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={listing.repository_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                )}
                {listing.website_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
                {listing.documentation_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={listing.documentation_url} target="_blank" rel="noopener noreferrer">
                      <Book className="h-4 w-4 mr-2" />
                      Documentation
                    </a>
                  </Button>
                )}
                {listing.npm_package && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a
                      href={`https://www.npmjs.com/package/${listing.npm_package}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      NPM Package
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {listing.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/mcp/categories/${listing.category.slug}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                      {listing.category.name}
                    </Badge>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {listing.license && (
                  <div>
                    <dt className="font-medium mb-1">License</dt>
                    <dd className="text-muted-foreground">{listing.license}</dd>
                  </div>
                )}
                {listing.version && (
                  <div>
                    <dt className="font-medium mb-1">Latest Version</dt>
                    <dd className="text-muted-foreground">{listing.version}</dd>
                  </div>
                )}
                {listing.created_at && (
                  <div>
                    <dt className="font-medium mb-1">Added</dt>
                    <dd className="text-muted-foreground">
                      {new Date(listing.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
              </CardContent>
            </Card>

            {socialLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {socialLinks.map((link) => (
                    <Button key={link.id} asChild variant="outline" size="sm" className="w-full justify-start">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.platform}
                      </a>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
