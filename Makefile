COMPOSE ?= docker compose
NPM ?= npm
COMPOSER ?= composer

PLUGIN_DIR := plugins/decormos-blocks
THEME_DIR := themes/decormos-theme

.DEFAULT_GOAL := help

.PHONY: help init install up down restart ps logs wp shell \
	theme-install theme-dump-autoload \
	blocks-install blocks-start blocks-build blocks-format blocks-lint blocks-lint-js blocks-lint-css blocks-zip blocks-packages-update \
	create-block create-block-dynamic build lint format

help: ## Show available commands
	@echo Usage:
	@echo   make ^<target^>
	@echo.
	@echo Targets:
	@echo   init                    Install dependencies and build assets
	@echo   install                 Install theme and block plugin dependencies
	@echo   up                      Start WordPress stack
	@echo   down                    Stop WordPress stack
	@echo   restart                 Restart WordPress stack
	@echo   ps                      Show Docker Compose services
	@echo   logs                    Follow WordPress stack logs
	@echo   wp                      Run WP-CLI command: make wp ARGS="plugin list"
	@echo   shell                   Open a shell in the WordPress container
	@echo   theme-install           Install theme Composer dependencies
	@echo   theme-dump-autoload     Regenerate theme Composer autoload files
	@echo   blocks-install          Install block plugin npm dependencies
	@echo   blocks-start            Start block plugin development build watcher
	@echo   blocks-build            Build block plugin assets
	@echo   blocks-format           Format block plugin source files
	@echo   blocks-lint             Run block plugin JS and CSS linters
	@echo   blocks-zip              Create a distributable block plugin zip
	@echo   blocks-packages-update  Update WordPress npm packages
	@echo   create-block            Create a static block: make create-block NAME=hero
	@echo   create-block-dynamic    Create a dynamic block: make create-block-dynamic NAME=portfolio
	@echo   build                   Build project assets
	@echo   lint                    Run project linters
	@echo   format                  Format project source files

init: install build ## Install dependencies and build assets

install: theme-install blocks-install ## Install theme and block plugin dependencies

up: ## Start WordPress stack
	$(COMPOSE) up -d

down: ## Stop WordPress stack
	$(COMPOSE) down

restart: down up ## Restart WordPress stack

ps: ## Show Docker Compose services
	$(COMPOSE) ps

logs: ## Follow WordPress stack logs
	$(COMPOSE) logs -f

wp: ## Run WP-CLI command, for example: make wp ARGS="plugin list"
	$(COMPOSE) run --rm wp-cli $(ARGS)

shell: ## Open a shell in the WordPress container
	$(COMPOSE) exec wordpress bash

theme-install: ## Install theme Composer dependencies
	$(COMPOSER) --working-dir=$(THEME_DIR) install

theme-dump-autoload: ## Regenerate theme Composer autoload files
	$(COMPOSER) --working-dir=$(THEME_DIR) dump-autoload

blocks-install: ## Install block plugin npm dependencies
	$(NPM) --prefix $(PLUGIN_DIR) install

blocks-start: ## Start block plugin development build watcher
	$(NPM) --prefix $(PLUGIN_DIR) run start

blocks-build: ## Build block plugin assets
	$(NPM) --prefix $(PLUGIN_DIR) run build

blocks-format: ## Format block plugin source files
	$(NPM) --prefix $(PLUGIN_DIR) run format

blocks-lint: blocks-lint-js blocks-lint-css ## Run block plugin JS and CSS linters

blocks-lint-js: ## Run block plugin JS linter
	$(NPM) --prefix $(PLUGIN_DIR) run lint:js

blocks-lint-css: ## Run block plugin CSS linter
	$(NPM) --prefix $(PLUGIN_DIR) run lint:css

blocks-zip: ## Create a distributable block plugin zip
	$(NPM) --prefix $(PLUGIN_DIR) run plugin-zip

blocks-packages-update: ## Update WordPress npm packages
	$(NPM) --prefix $(PLUGIN_DIR) run packages-update

create-block: ## Create a static Gutenberg block, for example: make create-block NAME=hero
	$(NPM) --prefix $(PLUGIN_DIR) run create:block -- $(NAME)

create-block-dynamic: ## Create a dynamic Gutenberg block, for example: make create-block-dynamic NAME=portfolio
	$(NPM) --prefix $(PLUGIN_DIR) run create:block:dynamic -- $(NAME)

build: blocks-build ## Build project assets

lint: blocks-lint ## Run project linters

format: blocks-format ## Format project source files
