export function validateContent(content) {
  const errors = [];

  if (!content || typeof content !== 'object') {
    errors.push('content is not an object');
    return { ok: false, errors };
  }

  if (!content.meta || typeof content.meta !== 'object') {
    errors.push('meta missing or invalid');
  }

  if (content.hero && !Array.isArray(content.hero.about_paragraphs)) {
    errors.push('hero.about_paragraphs should be array');
  }

  if (content.impact?.metrics && !Array.isArray(content.impact.metrics)) {
    errors.push('impact.metrics should be array');
  }

  if (Array.isArray(content.impact?.metrics)) {
    content.impact.metrics.forEach((metric, index) => {
      if (typeof metric !== 'object') {
        errors.push(`impact.metrics[${index}] should be object`);
        return;
      }

      if (!('display' in metric) && !('value' in metric)) {
        errors.push(`impact.metrics[${index}] requires display or value`);
      }

      if ('animate' in metric && typeof metric.animate !== 'boolean') {
        errors.push(`impact.metrics[${index}].animate should be boolean`);
      }
    });
  }

  if (content.featured?.project?.constraints && !Array.isArray(content.featured.project.constraints)) {
    errors.push('featured.project.constraints should be array');
  }

  if (content.contact?.links && !Array.isArray(content.contact.links)) {
    errors.push('contact.links should be array');
  }

  return { ok: errors.length === 0, errors };
}
