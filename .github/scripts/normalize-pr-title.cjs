#!/usr/bin/env node

/**
 * Shared script for normalizing PR titles to conventional commit format
 * Adapted for ra2mp3 bash project - removed project-specific Linear issue references
 */

// Valid conventional commit types
const VALID_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'release'];

// Regex patterns
const patterns = {
  // Strict validation - lowercase types only
  validFormat: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\(.+\))?!?: .+$/,
  
  // Case-insensitive validation
  validFormatInsensitive: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\(.+\))?!?: .+$/i,
  
  // Extract type, scope, and breaking change (case-insensitive)
  typeExtraction: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\((.+?)\))?(!?):\s*(.+)$/i,
  
  // Remove existing type prefix (case-insensitive)
  removePrefix: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\(.+?\))?!?:\s*/i
};

/**
 * Check if a title is valid according to conventional commits
 */
function isValidTitle(title) {
  return patterns.validFormat.test(title) || title.includes('[semantic pr title]');
}

/**
 * Check if a title has correct structure but wrong case
 */
function needsCaseCorrection(title) {
  return !patterns.validFormat.test(title) && patterns.validFormatInsensitive.test(title);
}

/**
 * Normalize a title that has correct structure but wrong case
 */
function normalizeCaseOnly(title) {
  const match = title.match(patterns.typeExtraction);
  if (!match) return null;
  
  const [, type, , scope, breaking, description] = match;
  const normalizedType = type.toLowerCase();
  const normalizedScope = scope ? scope.toLowerCase() : '';
  const normalizedBreaking = breaking || '';
  // Preserve proper case in description, only ensure sentence case (first letter lowercase)
  const normalizedDescription = description.charAt(0).toLowerCase() + description.slice(1);
  
  if (scope) {
    return `${normalizedType}(${normalizedScope})${normalizedBreaking}: ${normalizedDescription}`;
  } else {
    return `${normalizedType}${normalizedBreaking}: ${normalizedDescription}`;
  }
}

/**
 * Extract and analyze commit messages
 */
function analyzeCommits(commitMessages) {
  const typeRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\((.+?)\))?(!?):/i;
  
  const results = commitMessages
    .map(msg => {
      const match = msg.match(typeRegex);
      if (match) {
        const [, type, , scope, breaking] = match;
        const hasBreaking = breaking === '!' || msg.includes('BREAKING CHANGE');
        return { 
          type: type.toLowerCase(), 
          scope: scope ? scope.toLowerCase() : null, 
          breaking: hasBreaking, 
          message: msg 
        };
      }
      return null;
    })
    .filter(Boolean);
  
  const hasBreakingChanges = results.some(result => result.breaking);
  const types = results.map(result => result.type);
  const scopes = results.map(result => result.scope).filter(Boolean);
  
  return {
    results,
    hasBreakingChanges,
    types,
    scopes
  };
}

/**
 * Determine primary type based on priority
 */
function determinePrimaryType(types, hasBreakingChanges, analysisResults) {
  if (hasBreakingChanges) {
    const breakingResult = analysisResults.find(result => result.breaking);
    return breakingResult ? breakingResult.type : 'feat';
  }
  
  const priorityOrder = ['feat', 'fix', 'refactor', 'docs', 'style', 'test', 'build', 'ci', 'chore'];
  for (const type of priorityOrder) {
    if (types.includes(type)) {
      return type;
    }
  }
  
  return 'chore';
}

/**
 * Determine most common scope
 */
function determinePrimaryScope(scopes) {
  if (scopes.length === 0) return '';
  
  const scopeCounts = {};
  scopes.forEach(scope => {
    scopeCounts[scope] = (scopeCounts[scope] || 0) + 1;
  });
  
  const totalCommitsWithScope = scopes.length;
  const mostCommonScope = Object.keys(scopeCounts).reduce((a, b) => 
    scopeCounts[a] > scopeCounts[b] ? a : b
  );
  const mostCommonCount = scopeCounts[mostCommonScope];
  
  // Use scope if it appears in more than half of the scoped commits
  if (mostCommonCount > totalCommitsWithScope / 2) {
    return mostCommonScope;
  }
  
  return '';
}

/**
 * Generate a normalized PR title
 */
function generateTitle(currentTitle, commits, branchName) {
  // First check if we just need case correction
  if (needsCaseCorrection(currentTitle)) {
    const normalized = normalizeCaseOnly(currentTitle);
    if (normalized) return normalized;
  }
  
  // Extract commit information
  const commitMessages = commits.map(commit => 
    typeof commit === 'string' ? commit : commit.commit.message.split('\n')[0]
  );
  
  const analysis = analyzeCommits(commitMessages);
  
  // No commits - use branch name to determine type
  if (commits.length === 0) {
    // Preserve case but ensure sentence case (first letter lowercase)
    const titleToUse = currentTitle.charAt(0).toLowerCase() + currentTitle.slice(1);
    if (branchName && branchName.includes('feat')) {
      return `feat: ${titleToUse}`;
    } else if (branchName && branchName.includes('fix')) {
      return `fix: ${titleToUse}`;
    } else {
      return `chore: ${titleToUse}`;
    }
  }
  
  // Single commit with valid format - normalize it
  if (commits.length === 1 && analysis.results.length === 1) {
    const result = analysis.results[0];
    const msgMatch = result.message.match(/^([^:]+):\s*(.+)$/i);
    if (msgMatch) {
      const [, prefix, description] = msgMatch;
      // Preserve case but ensure sentence case (first letter lowercase)
      const normalizedDescription = description.charAt(0).toLowerCase() + description.slice(1);
      let newTitle = `${prefix.toLowerCase()}: ${normalizedDescription}`;
      
      // Add breaking change indicator if needed
      if (result.breaking && !newTitle.includes('!')) {
        newTitle = newTitle.replace(/^(\w+)(\(.+?\))?:/, '$1$2!:');
      }
      return newTitle;
    }
  }
  
  // Multiple commits or complex case
  const primaryType = determinePrimaryType(analysis.types, analysis.hasBreakingChanges, analysis.results);
  const primaryScope = determinePrimaryScope(analysis.scopes);
  
  // Extract base title and normalize
  let baseTitle = currentTitle
    .replace(' [semantic pr title]', '')
    .replace(patterns.removePrefix, '');
  // Preserve case but ensure sentence case (first letter lowercase)
  baseTitle = baseTitle.charAt(0).toLowerCase() + baseTitle.slice(1);
  
  // Build the type prefix
  let typePrefix = primaryType;
  if (analysis.hasBreakingChanges) {
    typePrefix += '!';
  }
  
  // Generate descriptive additions for multiple commit types
  if (analysis.results.length > 1) {
    const typeGroups = {};
    analysis.results.forEach(result => {
      if (!typeGroups[result.type]) typeGroups[result.type] = 0;
      typeGroups[result.type]++;
    });
    
    const typeDescriptions = [];
    Object.entries(typeGroups).forEach(([type, count]) => {
      if (type !== primaryType) {
        typeDescriptions.push(count > 1 ? `${type} changes` : `${type} change`);
      }
    });
    
    if (typeDescriptions.length > 0) {
      const additionalText = typeDescriptions.join(' and ');
      if (!baseTitle.includes(additionalText)) {
        baseTitle += ` with ${additionalText}`;
      }
    }
  }
  
  // Construct the final title
  if (primaryScope) {
    return `${typePrefix}(${primaryScope.toLowerCase()}): ${baseTitle}`;
  } else {
    return `${typePrefix}: ${baseTitle}`;
  }
}

/**
 * Ensure title follows conventional format and normalize
 */
function ensureValidFormat(title) {
  // Check if already valid
  if (patterns.validFormat.test(title)) {
    return title;
  }
  
  // Try to normalize case if structure is correct
  if (patterns.validFormatInsensitive.test(title)) {
    return normalizeCaseOnly(title) || title;
  }
  
  // Try to extract a valid type from the title
  const typeMatch = title.match(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)/i);
  if (typeMatch) {
    // Normalize the existing type
    return title.replace(/^[^:]+/, typeMatch[0].toLowerCase());
  }
  
  // Add chore prefix if no valid type found
  const desc = title.charAt(0).toLowerCase() + title.slice(1);
  return `chore: ${desc}`;
}

/**
 * Final normalization step
 */
function finalNormalize(title) {
  // Normalize the title: lowercase type/scope but preserve case in description (sentence case)
  return title.replace(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|release)(\((.+?)\))?(!?): (.+)$/i, 
    (match, type, scopeGroup, scope, breaking, description) => {
      const normalizedType = type.toLowerCase();
      const normalizedScope = scope ? scope.toLowerCase() : '';
      const normalizedBreaking = breaking || '';
      // Preserve case but ensure sentence case (first letter lowercase)
      const normalizedDescription = description.charAt(0).toLowerCase() + description.slice(1);
      
      if (scopeGroup) {
        return `${normalizedType}(${normalizedScope})${normalizedBreaking}: ${normalizedDescription}`;
      } else {
        return `${normalizedType}${normalizedBreaking}: ${normalizedDescription}`;
      }
    });
}

/**
 * Main function to process PR title
 */
function processPRTitle(currentTitle, commits = [], branchName = '') {
  // Check if already valid AND properly cased
  if (isValidTitle(currentTitle)) {
    // Even if valid format, ensure description is lowercased
    const normalized = finalNormalize(currentTitle);
    if (normalized === currentTitle) {
      return { 
        newTitle: currentTitle, 
        changed: false,
        reason: 'already_valid'
      };
    } else {
      // Valid format but needs case normalization
      return {
        newTitle: normalized,
        changed: true,
        reason: 'case_correction'
      };
    }
  }
  
  // Generate new title
  let newTitle = generateTitle(currentTitle, commits, branchName);
  
  // Ensure valid format
  newTitle = ensureValidFormat(newTitle);
  
  // Final normalization
  newTitle = finalNormalize(newTitle);
  
  // Remove trailing periods
  newTitle = newTitle.replace(/\.$/, '');
  
  return {
    newTitle,
    changed: newTitle !== currentTitle,
    reason: needsCaseCorrection(currentTitle) ? 'case_correction' : 'format_correction'
  };
}

module.exports = {
  processPRTitle,
  isValidTitle,
  needsCaseCorrection,
  analyzeCommits,
  patterns,
  VALID_TYPES
};

// CLI interface for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node normalize-pr-title.cjs "<title>" [commits-json] [branch-name]');
    process.exit(1);
  }

  const title = args[0];
  const commits = args[1] ? JSON.parse(args[1]) : [];
  const branch = args[2] || '';

  const result = processPRTitle(title, commits, branch);
  console.log(JSON.stringify(result, null, 2));
}