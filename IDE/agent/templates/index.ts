// Template Registry
const reactVite = require('./react-vite');
const nextjs = require('./nextjs');
const express = require('./express');
const flask = require('./flask');
const html = require('./html');

const templates = [
    reactVite,
    nextjs,
    express,
    flask,
    html
];

module.exports = {
    templates,
    getTemplate: (name) => templates.find(t => t.name === name),
    listTemplates: () => templates.map(t => ({
        name: t.name,
        description: t.description,
        icon: t.icon,
        language: t.language
    }))
};
