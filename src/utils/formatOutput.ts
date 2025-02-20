import katex from 'katex'

export function formatOutput(content: string): string {
  if (content.includes("does not comply") || 
      content.includes("Failed to process")) {
    return content;
  }

  // Clean and standardize content
  const cleanContent = content
    .replace(/#{1,3}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^-\s*/gm, '• ')
    .replace(/^(\d+)\.\s+/gm, '$1. ')
    .trim()

  // Process content with modern formatting
  const processedContent = cleanContent
    // Format numbers and currency
    .replace(/€\s*\d+(?:[.,]\d+)*/g, match => 
      `<span class="font-mono text-blue-400">${match}</span>`
    )
    // Format dates with numbers
    .replace(/\d{3,4}['>]\s*\d{4}/g, match => 
      `<span class="font-mono text-blue-400">${match.replace(/['>]/, '')}</span>`
    )
    // Format standalone numbers
    .replace(/(?<![a-zA-Z])\d+(?:[.,]\d+)*(?![a-zA-Z])/g, match => 
      `<span class="font-mono text-blue-400">${match}</span>`
    )

  const sections = processedContent.split('\n\n')
  const formattedSections = sections.map(section => {
    // Main Headers
    if (section.match(/^[A-Z][A-Z\s]{3,}$/m)) {
      return `
        <div class="mb-6 mt-8 first:mt-4">
          <h1 class="text-xl font-light tracking-wide text-white opacity-90">
            ${section}
          </h1>
          <div class="h-px bg-gradient-to-r from-blue-400/20 to-transparent mt-2"></div>
        </div>`
    }

    // Subheaders
    if (section.match(/^(\d+\.\s)?[A-Z][a-zA-Z\s]+:/) || 
        section.includes('Analysis:') || 
        section.includes('Summary:')) {
      return `
        <div class="mb-4 mt-6">
          <h2 class="text-lg font-light text-white/90">
            ${section.replace(':', '')}
          </h2>
        </div>`
    }

    // Bullet Points
    if (section.includes('• ')) {
      const bullets = section.split('\n')
      return `
        <ul class="mb-4 space-y-2">
          ${bullets.map(bullet => 
            `<li class="flex items-start gap-2 text-white/80">
              <span class="text-blue-400/90 mt-1">•</span>
              <span>${bullet.replace('• ', '')}</span>
            </li>`
          ).join('')}
        </ul>`
    }

    // Key-Value Pairs
    if (section.match(/^[A-Za-z\s]+:\s/)) {
      return `
        <div class="mb-3 flex items-baseline gap-3">
          <span class="text-blue-400/90 font-medium min-w-[120px]">
            ${section.split(':')[0]}:
          </span>
          <span class="text-white/80">
            ${section.split(':')[1]}
          </span>
        </div>`
    }

    // Regular Paragraphs
    return `
      <p class="text-white/80 mb-4">
        ${section}
      </p>`
  })

  return `
    <div class="space-y-1 max-w-[800px]">
      ${formattedSections.join('\n')}
    </div>`
} 