/**
 * PostCSS Modify Selectors
 *
 * @author biati.digital
 * @url https://www.biati.digital
 * @license MIT
 */

module.exports = (opts = {}) => {
    let options = {
        replace: null,
        prefix: null,
        suffix: null,
        modify: null,
        ...opts,
    };

    return {
        postcssPlugin: 'modify-selectors',
        Once(css, { list }) {
            css.walkRules((rule) => {
                let updatedSelectors = [];

                for (let val of rule.selectors) {
                    let originalSelector = val.trim();

                    // Replacer
                    if (options.replace && options.replace.length) {
                        let wasReplaced = false;
                        options.replace.forEach((replacer) => {
                            const matches = checkSelectorMatch(
                                originalSelector,
                                replacer.match
                            );
                            if (matches) {
                                val = replacer.with;
                                wasReplaced = true;
                            }
                        });

                        if (wasReplaced) {
                            updatedSelectors.push(val);
                            continue;
                        }
                    }

                    // Modify
                    if (options.modify && options.modify.length) {
                        let wasModified = false;
                        options.modify.forEach((modifier) => {
                            const matches = checkSelectorMatch(
                                originalSelector,
                                modifier.match
                            );
                            if (
                                matches &&
                                typeof modifier.with === 'function'
                            ) {
                                val = modifier.with(val);
                                wasModified = true;
                            }
                        });

                        if (wasModified) {
                            updatedSelectors.push(val);
                            continue;
                        }
                    }

                    // Prefix
                    if (options.prefix && options.prefix.length) {
                        options.prefix.forEach((prefixer) => {
                            const matches = checkSelectorMatch(
                                originalSelector,
                                prefixer.match
                            );
                            if (matches) {
                                val = `${prefixer.with} ${val}`;
                            }
                        });
                    }

                    // Suffix
                    if (options.suffix && options.suffix.length) {
                        options.suffix.forEach((suffixer) => {
                            const matches = checkSelectorMatch(
                                originalSelector,
                                suffixer.match
                            );
                            if (matches) {
                                val = `${val} ${suffixer.with}`;
                            }
                        });
                    }

                    updatedSelectors.push(val);
                }

                if (updatedSelectors.length) {
                    rule.selectors = updatedSelectors;
                }
            });

            function checkSelectorMatch(selector, match) {
                let matches = false;
                if (match === '*') {
                    return true;
                }
                if (typeof match === 'string' && match == selector) {
                    matches = true;
                } else if (typeof match === 'function') {
                    matches = match(selector);
                } else {
                    try {
                        matches = selector.match(match);
                    } catch (error) {}
                }
                return matches;
            }
        },
    };
};

module.exports.postcss = true;
