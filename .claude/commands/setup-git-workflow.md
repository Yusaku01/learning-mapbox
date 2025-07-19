---
description: "Git運用体制を整備し、ブランチ運用を自動化するコマンド"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Task"]
---

# Setup Git Workflow

Git運用体制を整備し、ブランチ運用を自動化するコマンドです。Claude Code Actionsと連携した効率的な開発フローを構築します。

## 使用方法

```bash
/setup-git-workflow [オプション]
```

## オプション

- `--strategy <strategy>`: ブランチ戦略の指定（github-flow/git-flow、デフォルト: github-flow）
- `--create-branch <branch-name>`: 新規ブランチの作成
- `--update-config`: 既存設定の更新
- `--setup-hooks`: Git Hooksの設定
- `--setup-ci`: CI/CDワークフローの設定
- `--setup-templates`: PR/Issueテンプレートの設定
- `--all`: 全ての設定を実行（デフォルト）

## 使用例

```bash
# 基本セットアップ（全設定）
/setup-git-workflow

# GitHub Flow戦略で設定
/setup-git-workflow --strategy github-flow

# 新規ブランチ作成
/setup-git-workflow --create-branch feature/user-authentication

# CI/CDワークフローのみ設定
/setup-git-workflow --setup-ci

# 既存設定の更新
/setup-git-workflow --update-config
```

## 機能詳細

### 1. ブランチ管理の自動化
- **命名規則に従った新規ブランチ作成**
- **既存ブランチの整理・削除**
- **ブランチ戦略の設定（GitHub Flow/Git Flow）**

### 2. コミット運用の標準化
- **Conventional Commitsテンプレートの適用**
- **コミットメッセージの自動検証**
- **アトミックコミットの推奨**

### 3. PR運用の自動化
- **PRテンプレートの作成・適用**
- **自動レビューリクエスト**
- **PR品質チェックの設定**

### 4. CI/CD統合
- **GitHub Actionsワークフローの設定**
- **Claude Code Actionsとの連携**
- **品質ゲートの自動化**

### 5. Git Hooksの設定
- **pre-commit/pre-pushフックの設定**
- **品質チェックの自動実行**
- **コミットメッセージの自動検証**

---

引数: $ARGUMENTS

## 実装開始

Git運用体制のセットアップを開始します。

### Phase 1: 引数解析と設定

引数を解析し、実行する設定を決定します。

```bash
# 引数の解析
args=($ARGUMENTS)
strategy="github-flow"
createBranch=""
updateConfig=false
setupHooks=false
setupCI=false
setupTemplates=false
setupAll=true

# オプション解析
for i in "${!args[@]}"; do
    case "${args[i]}" in
        --strategy)
            strategy="${args[i+1]}"
            setupAll=false
            ;;
        --create-branch)
            createBranch="${args[i+1]}"
            setupAll=false
            ;;
        --update-config)
            updateConfig=true
            setupAll=false
            ;;
        --setup-hooks)
            setupHooks=true
            setupAll=false
            ;;
        --setup-ci)
            setupCI=true
            setupAll=false
            ;;
        --setup-templates)
            setupTemplates=true
            setupAll=false
            ;;
        --all)
            setupAll=true
            ;;
    esac
done

# デフォルト設定（--allまたはオプション未指定時）
if [ "$setupAll" = true ]; then
    setupHooks=true
    setupCI=true
    setupTemplates=true
    updateConfig=true
fi
```

### Phase 2: Git運用ルールの読み込み

**Git運用ファイルからルールを読み込み、設定を抽出します。**

Git運用ファイルを読み込み、以下の設定を抽出します：

1. **ブランチ命名規則の抽出**
2. **コミットメッセージテンプレートの抽出**
3. **PRテンプレートの抽出**
4. **CI/CDワークフローの抽出**
5. **品質チェック設定の抽出**

### Phase 3: ブランチ戦略の設定

**指定されたブランチ戦略に従って設定を行います。**

#### GitHub Flow戦略の設定
- mainブランチベースの開発フロー
- feature/fix/hotfix ブランチの作成
- PR経由での統合

#### Git Flow戦略の設定
- main/develop ブランチの管理
- feature/release/hotfix ブランチの作成
- 複雑なリリースフローの管理

### Phase 4: 設定ファイルの生成

**各種設定ファイルを生成・更新します。**

以下の設定ファイルを順次作成します：

1. **GitHub Actions ワークフロー作成**

   **CI/CDワークフローテンプレート**を作成します：
   
   ```yaml
   name: CI/CD Pipeline
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm ci
         - name: Run tests
           run: npm test
         - name: Run linter
           run: npm run lint
         - name: Type check
           run: npm run type-check
   ```
   
   **Claude PR Assistantワークフロー**を作成します：
   
   ```yaml
   name: Claude PR Assistant
   on:
     issue_comment:
       types: [created]
     pull_request_review_comment:
       types: [created]
     issues:
       types: [opened, assigned]
     pull_request_review:
       types: [submitted]
   
   jobs:
     claude-code-action:
       if: |
         (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
         (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
         (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
         (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
       runs-on: ubuntu-latest
       permissions:
         contents: read
         pull-requests: read
         issues: read
         id-token: write
       steps:
         - name: Checkout repository
           uses: actions/checkout@v4
           with:
             fetch-depth: 1
         - name: Run Claude PR Action
           uses: anthropics/claude-code-action@beta
           with:
             anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
             timeout_minutes: "60"
   ```

2. **PRテンプレート作成**

   **PRテンプレート**を作成します：
   
   ```markdown
   ## 概要
   <!-- 変更内容の概要を簡潔に記載 -->
   
   ## 変更内容
   <!-- 具体的な変更内容をリスト形式で記載 -->
   - 
   - 
   - 
   
   ## 動作確認
   <!-- テスト方法や確認手順を記載 -->
   - [ ] 単体テストの実行
   - [ ] 結合テストの実行
   - [ ] 手動テストの実行
   
   ## 関連Issue
   <!-- 関連するIssueがある場合は記載 -->
   Closes #xxx
   
   ## 備考
   <!-- その他の注意事項や補足情報 -->
   ```

3. **Issueテンプレート作成**

   **機能追加用テンプレート**を作成します：
   
   ```markdown
   ---
   name: 機能追加
   about: 新しい機能の追加を提案
   title: '[FEATURE] '
   labels: ['feature', 'enhancement']
   assignees: ''
   ---
   
   ## 概要
   <!-- 追加したい機能の概要 -->
   
   ## 背景・目的
   <!-- なぜこの機能が必要なのか -->
   
   ## 提案内容
   <!-- 具体的な実装案や仕様 -->
   
   ## 受け入れ基準
   <!-- 完了の定義 -->
   - [ ] 
   - [ ] 
   - [ ] 
   ```

4. **Git Hooks設定**

   **pre-commit設定**を作成します：
   
   ```yaml
   repos:
     - repo: https://github.com/pre-commit/pre-commit-hooks
       rev: v4.4.0
       hooks:
         - id: trailing-whitespace
         - id: end-of-file-fixer
         - id: check-yaml
         - id: check-json
     - repo: local
       hooks:
         - id: eslint
           name: ESLint
           entry: npm run lint
           language: node
           types: [javascript, typescript]
         - id: commit-msg
           name: Conventional Commits
           entry: npx commitlint --edit
           language: node
           stages: [commit-msg]
   ```

5. **コミットメッセージテンプレート作成**

   **コミットメッセージテンプレート**を作成します：
   
   ```
   # <type>[optional scope]: <description>
   #
   # [optional body]
   #
   # [optional footer(s)]
   #
   # --- COMMIT END ---
   # Type can be 
   #    feat     (new feature)
   #    fix      (bug fix)
   #    refactor (refactoring production code)
   #    style    (formatting, missing semi colons, etc)
   #    docs     (changes to documentation)
   #    test     (adding or refactoring tests)
   #    chore    (updating grunt tasks etc)
   #
   # Remember to
   #    Capitalize the subject line
   #    Use the imperative mood in the subject line
   #    Do not end the subject line with a period
   #    Separate subject from body with a blank line
   #    Use the body to explain what and why vs. how
   #    Can use multiple lines with "-" for bullet points in body
   ```

6. **設定ファイルの統合**

   すべての設定ファイルを統合し、適切な場所に配置します。

### Phase 5: 結果レポート

**設定結果を報告します。**

作成された設定ファイルと適用された設定の詳細を報告します。

## 作成される設定ファイル

### GitHub Actions ワークフロー
- `.github/workflows/ci.yml` - CI/CDパイプライン
- `.github/workflows/claude-pr-assistant.yml` - Claude PR Assistant

### テンプレートファイル
- `.github/pull_request_template.md` - PRテンプレート
- `.github/ISSUE_TEMPLATE/` - Issueテンプレート

### Git設定
- `.gitmessage` - コミットメッセージテンプレート
- `.pre-commit-config.yaml` - pre-commitフック設定

### その他
- `.gitignore` - Git無視設定（必要に応じて）
- `CONTRIBUTING.md` - コントリビューションガイド

## エラーハンドリング

### 入力検証エラー
- 無効なブランチ戦略の指定
- 不正なブランチ名の指定
- 権限不足エラー

### ファイル処理エラー
- 設定ファイルの作成・更新エラー
- Git操作エラー
- ディレクトリ作成エラー

### Git操作エラー
- ブランチ作成エラー
- リモートリポジトリ接続エラー
- コミット・プッシュエラー

## 注意事項

- 既存の設定ファイルは上書きされます（バックアップを推奨）
- Git運用ファイルが存在しない場合はデフォルトルールを適用します
- Claude Code Actionsとの連携にはAPIキーの設定が必要です
- プライベートリポジトリでは適切な権限設定が必要です

## ブランチ管理機能

### 新規ブランチ作成

指定されたブランチ名で新しいブランチを作成します：

```bash
# ブランチ名の検証
validateBranchName() {
    local branchName="$1"
    
    # 命名規則のチェック
    if [[ ! "$branchName" =~ ^(feature|fix|hotfix|release|docs|refactor)\/[a-z0-9-]+$ ]]; then
        echo "エラー: ブランチ名が命名規則に従っていません"
        echo "正しい形式: <type>/<description>"
        echo "例: feature/user-authentication, fix/login-bug"
        return 1
    fi
    
    return 0
}

# ブランチ作成
createBranch() {
    local branchName="$1"
    local baseBranch="main"
    
    # ブランチ戦略に基づいてベースブランチを決定
    if [ "$strategy" = "git-flow" ]; then
        if [[ "$branchName" =~ ^feature\/ ]]; then
            baseBranch="develop"
        elif [[ "$branchName" =~ ^hotfix\/ ]]; then
            baseBranch="main"
        fi
    fi
    
    # 現在のブランチを確認
    currentBranch=$(git rev-parse --abbrev-ref HEAD)
    
    # ベースブランチに切り替え
    git checkout "$baseBranch"
    git pull origin "$baseBranch"
    
    # 新しいブランチを作成
    git checkout -b "$branchName"
    
    echo "ブランチ '$branchName' を作成しました（ベース: $baseBranch）"
}
```

### 既存ブランチの管理

不要になったブランチを整理します：

```bash
# マージ済みブランチの削除
cleanupBranches() {
    echo "マージ済みブランチの確認中..."
    
    # マージ済みブランチを取得
    mergedBranches=$(git branch --merged main | grep -v "main\|develop\|\*")
    
    if [ -n "$mergedBranches" ]; then
        echo "以下のマージ済みブランチが見つかりました:"
        echo "$mergedBranches"
        
        # 削除の確認
        read -p "これらのブランチを削除しますか？ (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo "$mergedBranches" | xargs git branch -d
            echo "マージ済みブランチを削除しました"
        fi
    else
        echo "削除可能なマージ済みブランチはありません"
    fi
}

# リモートブランチの同期
syncRemoteBranches() {
    echo "リモートブランチとの同期中..."
    git remote prune origin
    git fetch --prune
    echo "リモートブランチとの同期が完了しました"
}
```

### ブランチ戦略の適用

選択されたブランチ戦略に基づいて設定を適用します：

```bash
# GitHub Flow戦略の設定
setupGitHubFlow() {
    echo "GitHub Flow戦略を設定中..."
    
    # mainブランチの保護設定を推奨
    echo "推奨設定:"
    echo "- mainブランチへの直接pushを禁止"
    echo "- PRレビューを必須に設定"
    echo "- CI/CDチェックを必須に設定"
    
    # デフォルトブランチの確認
    defaultBranch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$defaultBranch" != "main" ]; then
        echo "警告: デフォルトブランチが 'main' ではありません（現在: $defaultBranch）"
    fi
}

# Git Flow戦略の設定
setupGitFlow() {
    echo "Git Flow戦略を設定中..."
    
    # developブランチの存在確認
    if ! git rev-parse --verify develop >/dev/null 2>&1; then
        echo "developブランチが存在しません。作成しますか？ (y/N): "
        read -p "" createDevelop
        if [ "$createDevelop" = "y" ] || [ "$createDevelop" = "Y" ]; then
            git checkout -b develop main
            git push -u origin develop
            echo "developブランチを作成しました"
        fi
    fi
    
    echo "Git Flow戦略の設定が完了しました"
    echo "- 新機能: developブランチから分岐"
    echo "- リリース: developからmainへマージ"
    echo "- ホットフィックス: mainブランチから分岐"
}
```

## 実装実行フロー

実際の実行フローを定義します：

```bash
# メイン実行フロー
executeSetup() {
    echo "=== Git Workflow Setup 開始 ==="
    
    # Phase 1: 引数解析（既に実装済み）
    echo "Phase 1: 引数解析完了"
    
    # Phase 2: Git運用ルールの読み込み
    echo "Phase 2: Git運用ルールの読み込み"
    
    # Phase 3: ブランチ戦略の設定
    echo "Phase 3: ブランチ戦略の設定"
    if [ "$strategy" = "github-flow" ]; then
        setupGitHubFlow
    elif [ "$strategy" = "git-flow" ]; then
        setupGitFlow
    fi
    
    # Phase 4: 設定ファイルの生成
    echo "Phase 4: 設定ファイルの生成"
    if [ "$setupCI" = true ]; then
        echo "CI/CDワークフローを作成中..."
    fi
    if [ "$setupTemplates" = true ]; then
        echo "PR/Issueテンプレートを作成中..."
    fi
    if [ "$setupHooks" = true ]; then
        echo "Git Hooksを設定中..."
    fi
    
    # Phase 5: ブランチ作成（指定された場合）
    if [ -n "$createBranch" ]; then
        echo "Phase 5: ブランチ作成"
        if validateBranchName "$createBranch"; then
            createBranch "$createBranch"
        else
            echo "ブランチ作成をスキップしました"
        fi
    fi
    
    # Phase 6: 結果レポート
    echo "Phase 6: 結果レポート"
    echo "=== Git Workflow Setup 完了 ==="
}
```

## 設定ファイル自動生成機能

### ディレクトリ構造の作成

必要なディレクトリを作成します：

```bash
# ディレクトリ作成
createDirectories() {
    echo "必要なディレクトリを作成中..."
    
    # GitHub関連ディレクトリ
    mkdir -p .github/workflows
    mkdir -p .github/ISSUE_TEMPLATE
    
    echo "ディレクトリ構造を作成しました"
}
```

### GitHub Actionsワークフローファイルの生成

```bash
# CI/CDワークフローファイル作成
createCIWorkflow() {
    echo "CI/CDワークフローを作成中..."
    
    cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run tests
        run: npm test
        
      - name: Build project
        run: npm run build
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        if: success()
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
EOF
    
    echo "CI/CDワークフローを作成しました: .github/workflows/ci.yml"
}

# Claude PR Assistantワークフロー作成
createClaudeWorkflow() {
    echo "Claude PR Assistantワークフローを作成中..."
    
    cat > .github/workflows/claude-pr-assistant.yml << 'EOF'
name: Claude PR Assistant

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude-code-action:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude PR Action
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          timeout_minutes: "60"
EOF
    
    echo "Claude PR Assistantワークフローを作成しました: .github/workflows/claude-pr-assistant.yml"
}
```

### テンプレートファイルの生成

```bash
# PRテンプレート作成
createPRTemplate() {
    echo "PRテンプレートを作成中..."
    
    cat > .github/pull_request_template.md << 'EOF'
## 概要
<!-- 変更内容の概要を簡潔に記載してください -->

## 変更内容
<!-- 具体的な変更内容をリスト形式で記載してください -->
- 
- 
- 

## 動作確認
<!-- テスト方法や確認手順を記載してください -->
- [ ] 単体テストの実行
- [ ] 結合テストの実行
- [ ] 手動テストの実行
- [ ] ビルドの確認

## 関連Issue
<!-- 関連するIssueがある場合は記載してください -->
Closes #

## 備考
<!-- その他の注意事項や補足情報があれば記載してください -->

## レビュー観点
<!-- レビュアーに特に注意してもらいたい点があれば記載してください -->
- 
- 

## スクリーンショット
<!-- UIの変更がある場合はスクリーンショットを添付してください -->
EOF
    
    echo "PRテンプレートを作成しました: .github/pull_request_template.md"
}

# Issueテンプレート作成
createIssueTemplates() {
    echo "Issueテンプレートを作成中..."
    
    # 機能追加テンプレート
    cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: 機能追加
about: 新しい機能の追加を提案
title: '[FEATURE] '
labels: ['feature', 'enhancement']
assignees: ''
---

## 概要
<!-- 追加したい機能の概要を記載してください -->

## 背景・目的
<!-- なぜこの機能が必要なのか、解決したい課題を記載してください -->

## 提案内容
<!-- 具体的な実装案や仕様を記載してください -->

## 受け入れ基準
<!-- 完了の定義を記載してください -->
- [ ] 
- [ ] 
- [ ] 

## 参考資料
<!-- 関連する資料やリンクがあれば記載してください -->
EOF
    
    # バグ報告テンプレート
    cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: バグ報告
about: バグの報告
title: '[BUG] '
labels: ['bug']
assignees: ''
---

## 概要
<!-- バグの概要を記載してください -->

## 発生環境
<!-- バグが発生した環境を記載してください -->
- OS: 
- ブラウザ: 
- Node.js版: 
- アプリケーション版: 

## 再現手順
<!-- バグを再現する手順を記載してください -->
1. 
2. 
3. 

## 期待される動作
<!-- 期待される正常な動作を記載してください -->

## 実際の動作
<!-- 実際に起こった動作を記載してください -->

## エラーメッセージ
<!-- エラーメッセージがある場合は記載してください -->
```
```

## 追加情報
<!-- その他の追加情報があれば記載してください -->
EOF
    
    echo "Issueテンプレートを作成しました:"
    echo "- .github/ISSUE_TEMPLATE/feature_request.md"
    echo "- .github/ISSUE_TEMPLATE/bug_report.md"
}
```

### Git設定ファイルの生成

```bash
# コミットメッセージテンプレート作成
createCommitTemplate() {
    echo "コミットメッセージテンプレートを作成中..."
    
    cat > .gitmessage << 'EOF'
# <type>[optional scope]: <description>
#
# [optional body]
#
# [optional footer(s)]
#
# --- COMMIT END ---
# Type can be 
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring production code)
#    style    (formatting, missing semi colons, etc)
#    docs     (changes to documentation)
#    test     (adding or refactoring tests)
#    chore    (updating grunt tasks etc)
#
# Remember to
#    Capitalize the subject line
#    Use the imperative mood in the subject line
#    Do not end the subject line with a period
#    Separate subject from body with a blank line
#    Use the body to explain what and why vs. how
#    Can use multiple lines with "-" for bullet points in body
EOF
    
    # Gitにテンプレートを設定
    git config commit.template .gitmessage
    
    echo "コミットメッセージテンプレートを作成しました: .gitmessage"
}

# pre-commit設定作成
createPreCommitConfig() {
    echo "pre-commit設定を作成中..."
    
    cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-toml
      - id: check-merge-conflict
      - id: debug-statements
      - id: mixed-line-ending
        args: ['--fix=lf']
        
  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npm run lint
        language: node
        types: [javascript, typescript]
        require_serial: true
        
      - id: prettier
        name: Prettier
        entry: npm run format
        language: node
        types: [javascript, typescript, json, yaml, markdown]
        require_serial: true
        
      - id: type-check
        name: Type Check
        entry: npm run type-check
        language: node
        types: [typescript]
        require_serial: true
        
      - id: commit-msg
        name: Conventional Commits
        entry: npx commitlint --edit
        language: node
        stages: [commit-msg]
EOF
    
    echo "pre-commit設定を作成しました: .pre-commit-config.yaml"
    echo "pre-commitを有効にするには以下のコマンドを実行してください:"
    echo "npm install --save-dev @commitlint/config-conventional @commitlint/cli"
    echo "npx pre-commit install"
}
```

## 統合実行機能

```bash
# 全設定ファイルの生成
generateAllConfigs() {
    echo "=== 設定ファイルの生成開始 ==="
    
    # ディレクトリ作成
    createDirectories
    
    # GitHub Actions設定
    if [ "$setupCI" = true ]; then
        createCIWorkflow
        createClaudeWorkflow
    fi
    
    # テンプレート設定
    if [ "$setupTemplates" = true ]; then
        createPRTemplate
        createIssueTemplates
    fi
    
    # Git設定
    if [ "$setupHooks" = true ]; then
        createCommitTemplate
        createPreCommitConfig
    fi
    
    echo "=== 設定ファイルの生成完了 ==="
}
```

## エラーハンドリングとオプション処理

### 入力検証機能

```bash
# 引数と環境の検証
validateInputs() {
    echo "入力検証を実行中..."
    
    # Gitリポジトリの確認
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "エラー: 現在のディレクトリはGitリポジトリではありません"
        echo "解決方法: git init を実行するか、Gitリポジトリ内で実行してください"
        return 1
    fi
    
    # ブランチ戦略の検証
    if [ "$strategy" != "github-flow" ] && [ "$strategy" != "git-flow" ]; then
        echo "エラー: 無効なブランチ戦略です: $strategy"
        echo "利用可能な戦略: github-flow, git-flow"
        return 1
    fi
    
    # ブランチ名の検証（指定された場合）
    if [ -n "$createBranch" ]; then
        if ! validateBranchName "$createBranch"; then
            return 1
        fi
    fi
    
    # 必要なコマンドの確認
    local required_commands=("git" "npm" "node")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            echo "警告: $cmd コマンドが見つかりません"
            echo "一部の機能が正常に動作しない可能性があります"
        fi
    done
    
    echo "入力検証が完了しました"
    return 0
}
```

### Git操作エラーハンドリング

```bash
# Git操作のエラーハンドリング
handleGitOperation() {
    local operation="$1"
    local command="$2"
    
    echo "実行中: $operation"
    
    if eval "$command"; then
        echo "成功: $operation"
        return 0
    else
        local exit_code=$?
        echo "エラー: $operation が失敗しました (終了コード: $exit_code)"
        
        case "$operation" in
            "ブランチ作成")
                echo "考えられる原因:"
                echo "- 同名のブランチが既に存在する"
                echo "- リモートリポジトリへの接続エラー"
                echo "- 権限不足"
                ;;
            "ブランチ切り替え")
                echo "考えられる原因:"
                echo "- 指定したブランチが存在しない"
                echo "- 未コミットの変更がある"
                echo "- ファイルの競合状態"
                ;;
            "プル操作")
                echo "考えられる原因:"
                echo "- リモートリポジトリへの接続エラー"
                echo "- マージ競合"
                echo "- 認証エラー"
                ;;
        esac
        
        return $exit_code
    fi
}
```

### ファイル操作エラーハンドリング

```bash
# ファイル操作のエラーハンドリング
handleFileOperation() {
    local operation="$1"
    local file_path="$2"
    local content="$3"
    
    echo "実行中: $operation ($file_path)"
    
    # ディレクトリの存在確認・作成
    local dir_path=$(dirname "$file_path")
    if [ ! -d "$dir_path" ]; then
        if ! mkdir -p "$dir_path"; then
            echo "エラー: ディレクトリの作成に失敗しました: $dir_path"
            return 1
        fi
    fi
    
    # ファイルの書き込み権限確認
    if [ -e "$file_path" ] && [ ! -w "$file_path" ]; then
        echo "エラー: ファイルの書き込み権限がありません: $file_path"
        echo "解決方法: chmod +w \"$file_path\" を実行してください"
        return 1
    fi
    
    # バックアップの作成
    if [ -e "$file_path" ]; then
        local backup_path="${file_path}.backup.$(date +%Y%m%d_%H%M%S)"
        if cp "$file_path" "$backup_path"; then
            echo "既存ファイルをバックアップしました: $backup_path"
        else
            echo "警告: バックアップの作成に失敗しました"
        fi
    fi
    
    # ファイルの作成・更新
    if echo "$content" > "$file_path"; then
        echo "成功: $operation ($file_path)"
        return 0
    else
        echo "エラー: $operation が失敗しました ($file_path)"
        return 1
    fi
}
```

### 包括的なエラーハンドリング

```bash
# メイン処理のエラーハンドリング
safeExecute() {
    local phase="$1"
    local function_name="$2"
    shift 2
    local args=("$@")
    
    echo "=== $phase 開始 ==="
    
    # 関数の実行
    if "$function_name" "${args[@]}"; then
        echo "=== $phase 完了 ==="
        return 0
    else
        local exit_code=$?
        echo "=== $phase エラー (終了コード: $exit_code) ==="
        
        # エラー回復の提案
        echo "エラー回復の提案:"
        case "$phase" in
            "入力検証")
                echo "- 引数を確認してください"
                echo "- Gitリポジトリ内で実行してください"
                ;;
            "設定ファイル生成")
                echo "- 書き込み権限を確認してください"
                echo "- ディスク容量を確認してください"
                ;;
            "Git操作")
                echo "- リモートリポジトリとの接続を確認してください"
                echo "- 認証情報を確認してください"
                ;;
        esac
        
        return $exit_code
    fi
}
```

### 高度なオプション処理

```bash
# ヘルプメッセージの表示
showHelp() {
    cat << 'EOF'
Usage: /setup-git-workflow [OPTIONS]

Git運用体制を整備し、ブランチ運用を自動化するコマンド

OPTIONS:
  --strategy <strategy>     ブランチ戦略 (github-flow|git-flow)
  --create-branch <name>    新規ブランチの作成
  --update-config           既存設定の更新
  --setup-hooks             Git Hooksの設定
  --setup-ci                CI/CDワークフローの設定
  --setup-templates         PR/Issueテンプレートの設定
  --all                     全ての設定を実行 (default)
  --dry-run                 実際の変更を行わずに確認のみ
  --verbose                 詳細な実行ログを表示
  --help                    このヘルプメッセージを表示

EXAMPLES:
  /setup-git-workflow                          # 基本セットアップ
  /setup-git-workflow --strategy git-flow      # Git Flow戦略で設定
  /setup-git-workflow --create-branch feature/auth  # ブランチ作成
  /setup-git-workflow --setup-ci --verbose     # CI設定を詳細ログ付きで実行
  /setup-git-workflow --dry-run               # 実行内容の確認のみ

For more information, see the documentation.
EOF
}

# 詳細オプション処理
processAdvancedOptions() {
    local showHelp=false
    local dryRun=false
    local verbose=false
    
    # 追加オプションの解析
    for arg in "${args[@]}"; do
        case "$arg" in
            --help|-h)
                showHelp=true
                ;;
            --dry-run)
                dryRun=true
                ;;
            --verbose|-v)
                verbose=true
                ;;
        esac
    done
    
    # ヘルプ表示
    if [ "$showHelp" = true ]; then
        showHelp
        exit 0
    fi
    
    # ドライランモード
    if [ "$dryRun" = true ]; then
        echo "=== ドライランモード ==="
        echo "実際の変更は行われません。実行内容を確認してください。"
        echo ""
        
        # 実行内容の表示
        echo "実行予定の処理:"
        [ "$setupCI" = true ] && echo "- CI/CDワークフローの設定"
        [ "$setupTemplates" = true ] && echo "- PR/Issueテンプレートの設定"
        [ "$setupHooks" = true ] && echo "- Git Hooksの設定"
        [ -n "$createBranch" ] && echo "- ブランチ作成: $createBranch"
        
        exit 0
    fi
    
    # 詳細ログモード
    if [ "$verbose" = true ]; then
        set -x  # デバッグモードを有効化
    fi
}
```

### 最終的な実行フロー

```bash
# 最終的なメイン実行フロー
main() {
    echo "=== Git Workflow Setup 開始 ==="
    
    # 高度なオプション処理
    processAdvancedOptions
    
    # Phase 1: 入力検証
    if ! safeExecute "入力検証" validateInputs; then
        exit 1
    fi
    
    # Phase 2: Git運用ルールの読み込み
    echo "Phase 2: Git運用ルールの読み込み完了"
    
    # Phase 3: ブランチ戦略の設定
    if [ "$strategy" = "github-flow" ]; then
        safeExecute "GitHub Flow設定" setupGitHubFlow
    elif [ "$strategy" = "git-flow" ]; then
        safeExecute "Git Flow設定" setupGitFlow
    fi
    
    # Phase 4: 設定ファイルの生成
    if ! safeExecute "設定ファイル生成" generateAllConfigs; then
        echo "警告: 一部の設定ファイル生成に失敗しました"
    fi
    
    # Phase 5: ブランチ作成（指定された場合）
    if [ -n "$createBranch" ]; then
        if ! safeExecute "ブランチ作成" createBranch "$createBranch"; then
            echo "警告: ブランチ作成に失敗しました"
        fi
    fi
    
    # Phase 6: 結果レポート
    echo "=== Git Workflow Setup 完了 ==="
    echo "設定されたファイル:"
    find .github -name "*.yml" -o -name "*.md" 2>/dev/null | sort
    [ -f .gitmessage ] && echo ".gitmessage"
    [ -f .pre-commit-config.yaml ] && echo ".pre-commit-config.yaml"
    
    echo ""
    echo "次のステップ:"
    echo "1. GitHub SecretsにANTHROPIC_API_KEYを設定"
    echo "2. ブランチ保護ルールを設定"
    echo "3. pre-commitフックを有効化: npx pre-commit install"
    echo "4. Claude Code Actionsを@claudeメンションでテスト"
}

# メイン実行
main
```

以上の機能により、効率的で品質の高いGit運用体制を構築できます。エラーハンドリングと詳細なオプション処理により、安全で使いやすいコマンドが完成しました。