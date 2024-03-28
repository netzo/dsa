import type { Unit } from "@/mod.ts";
import { getUnit, toPercent } from "@/mod.ts";
import { useComputed } from "@preact/signals";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "netzo/components/avatar.tsx";
import { Badge } from "netzo/components/badge.tsx";
import { TableRowActions } from "netzo/components/blocks/table/table.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "netzo/components/breadcrumb.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import { Checkbox } from "netzo/components/checkbox.tsx";
import { Combobox } from "netzo/components/combobox.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  type UseFormReturn,
} from "netzo/components/form.tsx";
import { Input } from "netzo/components/input.tsx";
import { Progress } from "netzo/components/progress.tsx";
import { Textarea } from "netzo/components/textarea.tsx";
import { cn } from "netzo/components/utils.ts";
import { GROUPS } from "./units.tsx";

type PageUnitProps = {
  id: string;
  unit: Unit;
  units: Unit[];
};

export function PageUnit(props: PageUnitProps) {
  const form = useForm<Unit>({
    defaultValues: getUnit(props.unit),
  });

  const onSubmit = async (data: Unit) => {
    const response = await fetch(`/api/units/${props.unit.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) globalThis.location.reload();
  };

  return (
    <Form {...form}>
      <form
        id="units.patch"
        className="h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <UnitHeader form={form} />

        <div className="flex flex-col gap-4 p-4">
          <UnitStatusStepper {...props} form={form} />
          <div className="grid lg:grid-cols-2 gap-4">
            <UnitCardFormUpdate {...props} form={form} />
            <UnitCardFormUpdateStatuses {...props} form={form} />
          </div>
        </div>
      </form>
    </Form>
  );
}

function UnitHeader(props: { form: UseFormReturn<Unit> }) {
  const original = props.form.getValues();
  const { name, image } = original;
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Breadcrumb className="text-xl font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/units">Units</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Avatar className="h-7 w-7">
                <AvatarImage src={image} />
                <AvatarFallback>
                  {name?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {name}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-row items-center gap-4">
        <TableRowActions
          row={{ original }}
          endpoint="/api/units"
          actions={["duplicate", "copyId", "remove"]}
        />
        <Button
          type="reset"
          variant="secondary"
          disabled={!props.form.formState.isDirty}
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={!props.form.formState.isDirty}
        >
          {props.form.formState.isLoading
            ? <i className="mdi-loading h-4 w-4 animate-spin" />
            : "Save"}
        </Button>
      </div>
    </header>
  );
}

function UnitStatusStepper(
  props: PageUnitProps & { form: UseFormReturn<Unit> },
) {
  const { status } = props.form.getValues();
  const onSelect = (status: string) => {
    console.log("onSelect", status);
    const config = { shouldDirty: true, shouldTouch: true };
    props.form.setValue("status", status, config);
  };
  return (
    <ol
      className={cn(
        "my-6 mb-4 mx-6",
        "flex justify-around gap-6 border-l-0 border-t",
      )}
    >
      {GROUPS.map((group) => (
        <li className="-mt-[14px]">
          <div
            className={cn(
              "block items-center pt-0 text-center",
              "hover:cursor-pointer hover:font-semibold",
            )}
            onClick={() => onSelect(group.id)}
          >
            <i
              {...group.icon}
              className={cn(
                "rounded-full h-[24px] w-[24px] ml-0 mr-0",
                status === group.id ? group.badge.className : "",
                group.icon.className,
                status !== group.id &&
                  "!bg-gray-200 dark:!bg-gray-700",
              )}
            />
            <h5
              className={cn(
                "mt-2 text-sm",
                status === group.id
                  ? "text-primary-500 dark:text-primary-300 font-semibold"
                  : "text-neutral-500 dark:text-neutral-300",
              )}
            >
              {group.title}
            </h5>
          </div>
        </li>
      ))}
    </ol>
  );
}

function UnitCardFormUpdate(
  { form, ...props }: PageUnitProps & { form: UseFormReturn<Unit> },
) {
  return (
    <CardContent>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <Combobox
                {...field}
                options={[
                  "pending",
                  "disassembly",
                  "cutting",
                  "armoring",
                  "painting",
                  "assembly",
                  "quality",
                  "delivered",
                ].map((value) => ({
                  label: value,
                  value,
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="currencyCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Moneda</FormLabel>
            <FormControl>
              <Combobox
                {...field}
                options={[{ label: "USD", value: "USD" }]}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}

const TASKS = {
  pending: {
    reception: {
      title: "Recepción",
      description:
        "Registro y evaluación inicial del vehículo, incluida la documentación inicial.",
    },
    inspection: {
      title: "Inspección",
      description:
        "Revisión detallada del estado actual del vehículo para identificar cualquier problema o necesidad específica.",
    },
    documentation: {
      title: "Documentación",
      description:
        "Preparación y archivo de todos los documentos necesarios para el proceso.",
    },
    inventoryOfParts: {
      title: "Inventario de partes",
      description:
        "Listado y verificación de todas las partes y componentes del vehículo antes del proceso de desmontaje.",
    },
    initialPhotos: {
      title: "Fotografías iniciales",
      description:
        "Toma de fotografías del vehículo desde diferentes ángulos para documentar su estado inicial.",
    },
    clientCommunication: {
      title: "Comunicación con el cliente",
      description:
        "Primera interacción con el cliente para confirmar detalles, expectativas y plazos.",
    },
  },
  disassembly: {
    interiorRemoval: {
      title: "Extracción del interior",
      description:
        "Desmontaje cuidadoso del interior del vehículo, incluidos asientos, revestimientos y paneles.",
    },
    exteriorComponentsRemoval: {
      title: "Extracción de componentes exteriores",
      description:
        "Remoción de partes exteriores del vehículo como parachoques, luces y espejos.",
    },
    engineAndDrivetrainInspection: {
      title: "Inspección de motor y tren motriz",
      description:
        "Revisión detallada del motor, la transmisión y otros componentes clave del sistema de propulsión.",
    },
    storageOfRemovedParts: {
      title: "Almacenamiento de partes removidas",
      description:
        "Organización y almacenamiento seguro de todas las partes removidas para su posterior reensamblaje.",
    },
    labelingAndDocumentation: {
      title: "Etiquetado y documentación",
      description:
        "Marcado y registro detallado de todas las partes desmontadas para garantizar un reensamblaje eficiente.",
    },
    photographicDocumentation: {
      title: "Documentación fotográfica",
      description:
        "Captura de imágenes detalladas del proceso de desmontaje para registros y seguimiento.",
    },
  },
  cutting: {
    materialSelection: {
      title: "Selección de material",
      description:
        "Elección de los materiales adecuados para el blindaje, basada en las especificaciones y necesidades del vehículo.",
    },
    cuttingPlanDesign: {
      title: "Diseño del plan de corte",
      description:
        "Creación de un plan detallado para el corte de materiales, asegurando precisión y eficiencia.",
    },
    cuttingExecution: {
      title: "Ejecución del corte",
      description:
        "Realización de los cortes de acuerdo con el plan establecido, utilizando herramientas de precisión.",
    },
    edgeFinishing: {
      title: "Acabado de bordes",
      description:
        "Proceso de suavizado y acabado de los bordes de los materiales cortados para garantizar un ensamblaje seguro.",
    },
    materialInspection: {
      title: "Inspección de material",
      description:
        "Revisión detallada de los materiales cortados para asegurar su calidad y medidas correctas.",
    },
    wasteManagement: {
      title: "Gestión de residuos",
      description:
        "Eliminación adecuada de los materiales sobrantes y residuos generados durante el proceso de corte.",
    },
  },
  armoring: {
    materialPreparation: {
      title: "Preparación de material",
      description:
        "Acondicionamiento de los materiales de blindaje antes de su instalación en el vehículo.",
    },
    panelFittingAndInstallation: {
      title: "Ajuste e instalación de paneles",
      description:
        "Montaje preciso de los paneles de blindaje en la carrocería del vehículo, asegurando cobertura total.",
    },
    ballisticGlassInstallation: {
      title: "Instalación de vidrio balístico",
      description:
        "Colocación de vidrios de seguridad diseñados para resistir impactos de proyectiles y fragmentos.",
    },
    reinforcedDoorMechanisms: {
      title: "Mecanismos reforzados de puertas",
      description:
        "Instalación de sistemas de refuerzo en las puertas para mejorar la protección y durabilidad.",
    },
    electricalSystemAdjustment: {
      title: "Ajuste del sistema eléctrico",
      description:
        "Modificación y aseguramiento del sistema eléctrico del vehículo para adaptarlo al blindaje instalado.",
    },
    armoringInspection: {
      title: "Inspección de blindaje",
      description:
        "Verificación exhaustiva del blindaje instalado para confirmar su correcta colocación y funcionalidad.",
    },
  },
  painting: {
    surfacePreparation: {
      title: "Preparación de superficie",
      description:
        "Limpieza, lijado y preparación de la superficie del vehículo para el proceso de pintura.",
    },
    primerApplication: {
      title: "Aplicación de imprimación",
      description:
        "Aplicación de una capa base para mejorar la adherencia de la pintura y proteger la superficie.",
    },
    colorCoatApplication: {
      title: "Aplicación de capa de color",
      description:
        "Aplicación uniforme de la pintura de color seleccionada sobre la imprimación.",
    },
    clearCoatApplication: {
      title: "Aplicación de capa transparente",
      description:
        "Aplicación de una capa final transparente para proteger la pintura y darle un acabado brillante.",
    },
    curingAndDrying: {
      title: "Curado y secado",
      description:
        "Proceso de endurecimiento de la pintura mediante secado al aire o en cabina de secado para asegurar su durabilidad.",
    },
    finalInspection: {
      title: "Inspección final",
      description:
        "Revisión detallada de la pintura y acabados para asegurar la calidad y uniformidad del trabajo realizado.",
    },
    detailing: {
      title: "Detallado",
      description:
        "Acabados finales y detallado del vehículo para presentar un aspecto impecable al cliente.",
    },
  },
  assembly: {
    interiorInstallation: {
      title: "Instalación del interior",
      description:
        "Reinstalación de los componentes interiores del vehículo, asegurando su correcta colocación y funcionamiento.",
    },
    exteriorComponentsInstallation: {
      title: "Instalación de componentes exteriores",
      description:
        "Montaje de las partes exteriores del vehículo, como parachoques, luces y espejos, después del proceso de pintura.",
    },
    engineAndDrivetrainAssembly: {
      title: "Ensamblaje de motor y tren motriz",
      description:
        "Reinstalación y ajuste del motor y el tren motriz en el vehículo, garantizando su óptimo rendimiento.",
    },
    functionalTesting: {
      title: "Pruebas funcionales",
      description:
        "Evaluación de las funciones del vehículo, incluyendo pruebas de manejo para verificar su correcto funcionamiento.",
    },
    finalAssemblyInspection: {
      title: "Inspección final de ensamblaje",
      description:
        "Inspección minuciosa después del ensamblaje para asegurar que todos los componentes estén correctamente instalados y funcionales.",
    },
    cleaningAndDetailing: {
      title: "Limpieza y detallado",
      description:
        "Limpieza profunda y detallado final del vehículo para entregarlo en condiciones óptimas al cliente.",
    },
  },
  quality: {
    ballisticResistanceTesting: {
      title: "Pruebas de resistencia balística",
      description:
        "Evaluación de la capacidad del blindaje para resistir impactos según las normas de seguridad establecidas.",
    },
    durabilityTesting: {
      title: "Pruebas de durabilidad",
      description:
        "Verificación de la resistencia de los materiales y componentes del vehículo a largo plazo.",
    },
    functionalityTesting: {
      title: "Pruebas de funcionalidad",
      description:
        "Comprobación del rendimiento general del vehículo y de sus sistemas integrados tras el proceso de blindaje.",
    },
    finalQualityInspection: {
      title: "Inspección final de calidad",
      description:
        "Revisión exhaustiva del vehículo para garantizar que cumple con todos los estándares de calidad antes de su entrega.",
    },
    clientReviewAndFeedback: {
      title: "Revisión y retroalimentación del cliente",
      description:
        "Presentación del vehículo al cliente para su aprobación final y recopilación de sus comentarios.",
    },
    correctiveActionsDocumentation: {
      title: "Documentación de acciones correctivas",
      description:
        "Registro de cualquier ajuste o mejora realizada en base a los hallazgos durante las inspecciones o a solicitud del cliente.",
    },
  },
  delivered: {
    clientCommunicationForDelivery: {
      title: "Comunicación con el cliente para entrega",
      description:
        "Notificación al cliente sobre la finalización y disponibilidad del vehículo para su entrega o recogida.",
    },
    finalDocumentationAndInvoice: {
      title: "Documentación final y factura",
      description:
        "Preparación y entrega de todos los documentos finales relacionados con el servicio realizado, incluyendo la factura.",
    },
    deliveryOrPickup: {
      title: "Entrega o recogida",
      description:
        "Proceso de entrega del vehículo al cliente o coordinación para su recogida en las instalaciones.",
    },
    postDeliveryFollowUp: {
      title: "Seguimiento post entrega",
      description:
        "Contacto posterior con el cliente para asegurar su satisfacción y resolver cualquier duda o problema.",
    },
    customerSatisfactionSurvey: {
      title: "Encuesta de satisfacción al cliente",
      description:
        "Recopilación de opiniones y comentarios del cliente sobre el servicio recibido para mejorar procesos futuros.",
    },
  },
};

function UnitCardFormUpdateStatuses(
  { form, ...props }: PageUnitProps & { form: UseFormReturn<Unit> },
) {
  const { status, tasks } = form.getValues();

  const task = useComputed(() => tasks?.[status] ?? {});

  // divide completed tasks by total tasks
  const progress = useComputed(() => {
    const completed = Object.values(task.value).filter((t) =>
      t === true
    )?.length ?? 0;
    return completed / Object.values(task.value)?.length;
  });

  const group = GROUPS.find((group) => group.id === status);

  return (
    <Card className="border-none">
      <CardHeader>
        <Progress value={progress.value * 100} className="mb-2" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <i className={cn(group?.icon?.className, "w-5 h-5")} />
            <CardTitle className="text-base font-medium">
              {group?.title}
            </CardTitle>
          </div>
          <div className="h-2 flex-1" />
          <Badge variant="outline">
            {toPercent(progress.value)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {Object.entries(task.value).map(([id, task]) => (
          <FormField
            control={form.control}
            name={`tasks.${status}.${id}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {TASKS?.[status]?.[id]?.title ?? id}
                  </FormLabel>
                  <FormDescription>
                    {TASKS?.[status]?.[id]?.description ?? id}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
}
