import { ErrorObject } from 'ajv';
import { FormEngine } from '../orchestrator/form-configurator';
import { RendererRegistryEntry, Renderer, RendererProps } from './renderer.types';
import { DataSchema, Layout } from '../store';
import { ILogger, noOpLogger } from '../utils/logger';

function findBestRenderer(
  uischema: Layout,
  schema: DataSchema,
  registry: RendererRegistryEntry[],
  logger: ILogger
): Renderer {
  let bestRank = -1;
  let bestRenderer: Renderer | null = null;

  for (const entry of registry) {
    const rank = entry.tester(uischema, schema);
    if (rank > bestRank) {
      bestRank = rank;
      bestRenderer = entry.renderer;
    }
  }
  if (!bestRenderer) {
    logger.error('No renderer found', {
      uischemaType: uischema.type,
      schemaType: schema.type,
    });
    throw new Error(`No renderer found for uischema: ${JSON.stringify(uischema)}`);
  }

  logger.debug('Renderer selected', {
    uischemaType: uischema.type,
    rank: bestRank,
  });

  return bestRenderer;
}

export function renderUi(
  uischema: Layout,
  schema: DataSchema,
  data: any,
  errors: ErrorObject[],
  registry: RendererRegistryEntry[],
  engine: FormEngine,
  enablement: Record<string, boolean>,
  visibility: Record<string, boolean>,
  logger?: ILogger
): any {
  const log = logger || noOpLogger;
  function renderElement(
    uiElement: Layout,
    schemaScope: DataSchema,
    dataScope: any,
    path: string,
    enablement: Record<string, boolean>,
    visibility: Record<string, boolean>,
    parentSchema?: DataSchema
  ): any {
    log.debug('Rendering element', {
      type: uiElement.type,
      path: path || 'root',
    });

    const renderer = findBestRenderer(uiElement, schemaScope, registry, log);
    const isRequired = parentSchema?.required?.includes(path.split('.').pop() || '');

    const props: RendererProps = {
      uischema: uiElement,
      schema: schemaScope,
      data: dataScope,
      path,
      errors,
      engine,
      isEnabled: enablement[path] !== false,
      isVisible: visibility[path] !== false,
      isRequired,
      renderChild: (childUi, childSchema, childPath) => {
        const isControl = childUi.type === 'Control';
        const dataPath = isControl ? childPath : '';
        const dataObject = isControl ? dataScope[childPath] : dataScope;
        return renderElement(childUi as Layout, childSchema, dataObject, dataPath, enablement, visibility, schema);
      },
      registerControl: engine.registerControl,
      updateField: engine.updateField,
    };
    return renderer(props);
  }

  return renderElement(uischema, schema, data, '', enablement, visibility, schema);
}
