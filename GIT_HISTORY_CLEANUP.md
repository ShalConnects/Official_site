# Git History Cleanup - Remove Exposed API Key

## 🔍 Repository Information

**GitHub Repository:** https://github.com/ShalConnects/Official_site.git

**Exposed API Key:** `REMOVED_API_KEY`

The API key was committed in these files:
- `api/download.js`
- `api/verify-transaction.js`
- `src/utils/paddleApi.ts`
- Documentation files (`.md` and `.txt`)

## ⚠️ Important: Key is Still in Git History

Even though we've removed the key from current files, **it's still in your Git history**. Anyone who clones the repository can see it in old commits.

## 🛠️ How to Remove from Git History

### Option 1: Use git-filter-repo (Recommended)

**Install git-filter-repo:**
```bash
# Windows (using pip)
pip install git-filter-repo

# Or download from: https://github.com/newren/git-filter-repo
```

**Remove the key from history:**
```bash
# Navigate to your repository
cd C:\Users\salau\Downloads\Projects\ShalConnects

# Remove the API key from all commits
git filter-repo --replace-text <(echo "REMOVED_API_KEY==>REMOVED_API_KEY")

# Force push (WARNING: This rewrites history!)
git push origin --force --all
git push origin --force --tags
```

### Option 2: Use BFG Repo-Cleaner (Easier)

**Download BFG:**
1. Download from: https://rtyley.github.io/bfg-repo-cleaner/
2. Save as `bfg.jar`

**Clean the repository:**
```bash
# Create a file with the key to remove
echo "REMOVED_API_KEY" > keys.txt

# Run BFG
java -jar bfg.jar --replace-text keys.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

### Option 3: Create New Repository (Safest if Public)

If the repository is public or you want to be extra safe:

1. Create a new repository on GitHub
2. Copy all files (excluding `.git` folder)
3. Initialize new git repo:
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit - cleaned"
   git remote add origin https://github.com/ShalConnects/Official_site_new.git
   git push -u origin main
   ```
4. Update Vercel/deployment to point to new repo

### Option 4: Contact GitHub Support (If Public Repo)

If your repository is public:
1. Go to: https://support.github.com/contact
2. Request removal of sensitive data
3. GitHub can help remove it from history

## ⚠️ WARNING: Force Push Required

**Important:** After cleaning history, you MUST force push:
```bash
git push origin --force --all
git push origin --force --tags
```

**This will:**
- ✅ Remove the key from all commits
- ⚠️ Rewrite Git history (all commit hashes will change)
- ⚠️ Anyone who cloned the repo will need to re-clone
- ⚠️ Any forks will be out of sync

## ✅ After Cleaning History

1. **Verify the key is gone:**
   ```bash
   git log --all -S "pdl_live_apikey_01kafwq9facpvavmctmnvnnczm" --oneline
   ```
   Should return nothing.

2. **Update collaborators:**
   - Tell anyone who cloned the repo to delete and re-clone
   - Or they can: `git fetch origin && git reset --hard origin/main`

3. **Update deployment:**
   - If using Vercel, it should auto-update
   - Verify deployment still works

## 🔒 Prevent Future Exposure

1. ✅ **Never commit API keys** - Always use environment variables
2. ✅ **Use `.env.local`** - Already in `.gitignore`
3. ✅ **Review before committing:**
   ```bash
   git diff --cached | grep -i "api.*key\|paddle.*key"
   ```
4. ✅ **Use Git hooks** to prevent committing keys:
   - Create `.git/hooks/pre-commit` to scan for keys

## 📝 Quick Checklist

- [ ] Decide which cleanup method to use
- [ ] Backup your repository (just in case)
- [ ] Run cleanup tool (git-filter-repo or BFG)
- [ ] Verify key is removed from history
- [ ] Force push to GitHub
- [ ] Notify collaborators (if any)
- [ ] Verify deployment still works
- [ ] Create new API key in Paddle
- [ ] Update environment variables

## 🆘 Need Help?

If you're unsure about cleaning Git history:
- **Option 3 (New Repo)** is the safest and easiest
- Or contact GitHub support for assistance

---

**Repository:** https://github.com/ShalConnects/Official_site.git

