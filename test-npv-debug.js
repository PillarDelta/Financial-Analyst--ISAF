/**
 * NPV Debug Test - Find out why NPV is showing €0M
 */

console.log('🔍 NPV CALCULATION DEBUG TEST\n');

const testData = `
### COMPANY INFORMATION
- Name: Tesla Inc
- Revenue: $96.8 billion (2023)
- Operating EBITDA: $11.5 billion

### PROJECTS
- Gigafactory Texas: $7.5B manufacturing expansion
- Supercharger Network: $2.8B infrastructure
- FSD Development: $1.2B autonomous driving

### TARGETS  
- Market Share: 25% EV market by 2027
- EBITDA Target: $20B by 2026
`;

console.log('Test Data:');
console.log(testData);

console.log('\n📊 TESTING PROJECT EXTRACTION\n');

// Test project extraction patterns manually - UPDATED to match fixed patterns
const projectPatterns = [
  // Pattern 1: Simple format "Project Name: $X.XB description"
  /([A-Za-z][^:\n]*?):\s*[€$£¥]?([0-9,\.]+)([BM])\s*([^.\n]*)/gi,
  // Pattern 2: Value first format "$X.XB Project Name"
  /[€$£¥]([0-9,\.]+)([BM])\s*([^\n]+?(?:facility|partnership|project|investment|systems|acquisition|expansion|development|BESS|solar|gallium|subsea|infrastructure|storage|renewable|Gigafactory|Supercharger|FSD))/gi,
  // Pattern 3: Investment/cost format "Project Name (€X.XB investment)"
  /([^(\n]+?)\s*\([€$£¥]?([0-9,\.]+)([BM])[^)]*\)/gi,
  // Pattern 4: Bullet point format "- Project Name: €X.XM description"
  /-\s*([^:\n]+?):\s*[€$£¥]?([0-9,\.]+)([BM]?)\s*([^.\n]*)/gi,
  // Pattern 5: "Strategic XXX project" format
  /(strategic\s+[^-\n]*?):\s*[€$£¥]?([0-9,\.]+)([BM]?)/gi,
  // Pattern 6: General format "XXX facility/project €X.XM"
  /([^-\n]+(?:facility|partnership|project|investment|systems|acquisition|expansion|development|BESS|solar|gallium|subsea|infrastructure|storage|renewable))\s*[:\s]*[€$£¥]?([0-9,\.]+)([BM]?)/gi
];

const projects = [];
let totalMatches = 0;

projectPatterns.forEach((pattern, patternIndex) => {
  pattern.lastIndex = 0;
  let match;
  
  console.log(`Testing Pattern ${patternIndex+1}:`);
  
  while ((match = pattern.exec(testData)) !== null && totalMatches < 20) {
    totalMatches++;
    console.log(`  Match: "${match[0]}"`);
    
    let name, valueStr, unit, description = '';
    
    // Extract data based on pattern structure
    if (patternIndex === 0 || patternIndex === 3 || patternIndex === 4) {
      // Patterns: name : value description
      name = match[1]?.trim();
      valueStr = match[2]?.replace(/[,]/g, '');
      unit = match[3]?.toLowerCase();
      description = match[4]?.trim() || '';
    } else if (patternIndex === 1) {
      // Pattern: value name
      valueStr = match[1]?.replace(/[,]/g, '');
      unit = match[2]?.toLowerCase();
      name = match[3]?.trim();
    } else if (patternIndex === 2) {
      // Pattern: name (value)
      name = match[1]?.trim();
      valueStr = match[2]?.replace(/[,]/g, '');
      unit = match[3]?.toLowerCase();
    } else {
      // Patterns 5 & 6: name : value or name value
      name = match[1]?.trim();
      valueStr = match[2]?.replace(/[,]/g, '');
      unit = match[3]?.toLowerCase();
    }
    
    if (!name || !valueStr) continue;
    
    // Parse financial value with proper unit conversion
    let value = parseFloat(valueStr);
    if (isNaN(value) || value <= 0) continue;
    
    // Convert units to millions (M)
    if (unit?.includes('b') || description?.toLowerCase().includes('billion')) {
      value *= 1000; // Convert billions to millions
    }
    // If no unit and value < 100, assume it's already in billions
    else if (!unit && value < 100) {
      value *= 1000;
    }
    
    if (name && value && value > 0) {
      console.log(`    → Extracted: "${name}" = $${value}M`);
      
      projects.push({
        name: name,
        value: value,
        status: 'in-progress',
        timeline: '12-24 months',
        strategicImportance: 'high',
        riskLevel: 'medium'
      });
    } else {
      console.log(`    ❌ Failed to extract properly: name="${name}", value="${value}"`);
    }
  }
});

console.log(`\n✅ EXTRACTION RESULTS:`);
console.log(`Projects found: ${projects.length}`);
projects.forEach((p, i) => {
  console.log(`  ${i+1}. ${p.name}: $${p.value}M`);
});

console.log('\n🧮 TESTING NPV CALCULATIONS\n');

if (projects.length > 0) {
  const topProject = projects[0];
  
  console.log(`Testing NPV for: ${topProject.name}`);
  console.log(`Project value: $${topProject.value}M`);
  
  // Calculate NPV like the actual function
  const baseNPV = topProject.value * 0.6; // Base 60% of project value
  let multiplier = 1.0;
  
  if (topProject.strategicImportance === 'high') multiplier *= 1.2;
  if (topProject.riskLevel === 'low') multiplier *= 1.1;
  if (topProject.riskLevel === 'high') multiplier *= 0.8;
  
  // Special adjustments
  if (topProject.name.toLowerCase().includes('gallium')) multiplier *= 1.3;
  if (topProject.name.toLowerCase().includes('partnership')) multiplier *= 1.15;
  if (topProject.name.toLowerCase().includes('infrastructure')) multiplier *= 0.9;
  if (topProject.name.toLowerCase().includes('gigafactory')) multiplier *= 1.1; // Add Tesla specific
  
  const finalNPV = baseNPV * multiplier;
  
  console.log(`  Base NPV (60% of value): $${baseNPV}M`);
  console.log(`  Multiplier: ${multiplier}`);
  console.log(`  Final NPV: $${finalNPV}M`);
  
  if (finalNPV > 0) {
    console.log(`  ✅ NPV calculation working correctly!`);
  } else {
    console.log(`  ❌ NPV is 0 - this is the problem!`);
  }
  
} else {
  console.log('❌ NO PROJECTS FOUND - This is why NPV is €0M!');
  console.log('The project extraction patterns are not matching the input text.');
}

console.log('\n🔧 RECOMMENDATION:');
if (projects.length === 0) {
  console.log('Fix project extraction patterns to capture:');
  console.log('- Gigafactory Texas: $7.5B manufacturing expansion');
  console.log('- Supercharger Network: $2.8B infrastructure');
  console.log('- FSD Development: $1.2B autonomous driving');
} else {
  console.log('Project extraction is working. Check why projects are not being passed to NPV calculation.');
} 