It is a system, loading plugins to perform various tasks, while trying to keep a safe and secure environment for the user.
The main goal is to provide a way to make tools easy to deploy and use.

It is composed of a backend, that is pl-common, and clients, such as the [CLI](https://gitlab.com/eVisualUser/pretty-launcher/-/tree/6dd24623b26d8f413698bd212336a3525ca506e4/clients/pretty-launcher-cli).

The main scripting language is Lua, with a focus on simplicity and ease of use.
A custom API is provided to interact with the system, allowing for easy plugin development and management.
And generated EmmyLua type definitions for better code completion and documentation can be generated.

## Goals:

- [ ] Cross-platform compatibility
- [ ] Fast plugin development
- [ ] Secure environment for the user and plugins

## State of development

It's only the start, for now the cli client is the only available client.
And through it, you have a helper to generate plugins and more.

A lot of remains to be done.
