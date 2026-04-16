import type { ScenarioLab } from './types';

const es_9: ScenarioLab = {
    id: 'es-9',
    title: 'MCP Config — Hardcoded Secrets in .mcp.json',
    domain: 'Domain 2 — Tool Design & MCP',
    domainNum: 2,
    scenario: 'An MCP server config has "JIRA_TOKEN": "abc123secret" hardcoded in .mcp.json. The file is committed to Git. Fix the security issue with environment variable substitution.',
    examTopic: '2.4 MCP Server Integration',
    difficulty: 'Easy',
    codeTemplate: `import json

# ============================================
# EXAM SCENARIO: Hardcoded secrets in .mcp.json
# ============================================
# BROKEN: API tokens hardcoded in config → committed to Git → leaked
# FIXED: Use \${ENV_VAR} substitution in .mcp.json
# ============================================

# ❌ BROKEN .mcp.json — secrets are readable by anyone with repo access
broken_config = {
    "mcpServers": {
        "jira": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-jira"],
            "env": {
                "JIRA_BASE_URL": "https://company.atlassian.net",
                "JIRA_API_TOKEN": "abc123secret",      # LEAKED!
                "JIRA_EMAIL": "admin@company.com",       # LEAKED!
            }
        },
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": "ghp_abc123xyz789"       # LEAKED!
            }
        }
    }
}

# ✅ FIXED .mcp.json — secrets come from environment variables
fixed_config = {
    "mcpServers": {
        "jira": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-jira"],
            "env": {
                "JIRA_BASE_URL": "https://company.atlassian.net",
                "JIRA_API_TOKEN": "\${JIRA_API_TOKEN}",   # From env!
                "JIRA_EMAIL": "\${JIRA_EMAIL}",            # From env!
            }
        },
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": "\${GITHUB_TOKEN}"          # From env!
            }
        }
    }
}


if __name__ == "__main__":
    print("=" * 60)
    print("❌ BROKEN .mcp.json:")
    print("=" * 60)
    print(json.dumps(broken_config, indent=2))
    print()
    print("⚠️  Problems:")
    print("   - API tokens visible in Git history FOREVER")
    print("   - Anyone with repo access has your secrets")
    print("   - Secret scanning tools will flag this")
    print("   - Even if you delete the file, it's in Git history")

    print(f"\\n\\n{'='*60}")
    print("✅ FIXED .mcp.json:")
    print("=" * 60)
    print(json.dumps(fixed_config, indent=2))
    print()
    print("✅ Benefits:")
    print("   - No secrets in config file")
    print("   - Safe to commit and share")
    print("   - Each developer/server provides their own env vars")
    print("   - .env file (not committed) holds actual secrets")

    print(f"\\n{'═'*60}")
    print("EXAM KEY POINTS:")
    print("  MCP config: Tools=actions, Resources=data, Prompts=templates")
    print("  Use \${ENV_VAR} substitution for ALL secrets in .mcp.json")
    print("  Never hardcode API keys, tokens, or passwords")
    print("  .env files go in .gitignore — .mcp.json goes in Git")
    print(f"{'═'*60}")`,
    expectedOutput: `Shows side-by-side comparison of broken vs fixed .mcp.json.
Key: \${ENV_VAR} substitution keeps secrets out of Git.`,
    brokenCode: `# ❌ BROKEN: Hardcoded secrets in .mcp.json (committed to Git!)
# 🐛 BUG: Real API tokens in version control
import json
import os

# 🐛 This is what the BROKEN .mcp.json looks like:
# It gets committed to Git with real credentials!

BROKEN_MCP_CONFIG = {
    "mcpServers": {
        "database": {
            "command": "uvx",
            "args": ["mcp-postgres"],
            "env": {
                # 🐛 Real database credentials in version control!
                "DATABASE_URL": "postgresql://admin:SuperSecret123@prod-db.example.com:5432/myapp"
            }
        },
        "weather": {
            "command": "uvx",
            "args": ["mcp-weather"],
            "env": {
                # 🐛 Real API key!
                "WEATHER_API_KEY": "sk-live-abc123def456ghi789jkl012mno345"
            }
        },
        "github": {
            "command": "uvx",
            "args": ["mcp-github"],
            "env": {
                # 🐛 GitHub personal access token!
                "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            }
        }
    }
}

# 🐛 This would be the CORRECT approach using environment variables:
CORRECT_MCP_CONFIG = {
    "mcpServers": {
        "database": {
            "command": "uvx",
            "args": ["mcp-postgres"],
            "env": {
                "DATABASE_URL": os.environ.get("DATABASE_URL", ""),  # ✅ From env!
            }
        },
        "weather": {
            "command": "uvx",
            "args": ["mcp-weather"],
            "env": {
                "WEATHER_API_KEY": os.environ.get("WEATHER_API_KEY", ""),  # ✅ From env!
            }
        }
    }
}


def demonstrate_issue():
    """Show the security problem."""
    print("=" * 60)
    print("🐛 BROKEN .mcp.json with hardcoded secrets:")
    print("=" * 60)
    print(json.dumps(BROKEN_MCP_CONFIG, indent=2))
    print()
    print("⚠️  If this file is committed to Git:")
    print("   - Anyone with repo access has production DB credentials")
    print("   - API keys are in git history forever")
    print("   - Secret scanning may catch it, but damage is done")
    print()
    print("✅ CORRECT .mcp.json using environment variables:")
    print("=" * 60)
    print(json.dumps(CORRECT_MCP_CONFIG, indent=2))


if __name__ == "__main__":
    demonstrate_issue()
`,
    hints: ["Never commit real secrets to version control.", "MCP supports variable substitution for env vars.", ".mcp.json should reference variables, not contain values."],
    fixes: ["Use variable substitution in .mcp.json and set real values in shell/env.", "Add .mcp.json with real tokens to .gitignore immediately.", "Audit Git history for any previously committed tokens."],
  };

export default es_9;
