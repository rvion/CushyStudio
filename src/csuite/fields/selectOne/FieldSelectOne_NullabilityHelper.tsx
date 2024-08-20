import type { Field_group_value } from '../group/FieldGroup'

type SubSelectsNonNullable<T> =
    T extends Field_group_value<infer G>
        ? {
              [K in keyof G]: G[K] extends S.SSelectOne<infer U> //
                  ? U
                  : T[K] // "T[K]" (not G[K]) here is on purpose.
          }
        : T extends undefined // discard the other values of the union Field_group_value<...> | undefined
          ? never
          : T extends null
            ? never
            : unknown

export const BANG_SELECT_REQUIRED_SUBFIELDS = <T extends any>(x: T): SubSelectsNonNullable<T> => x as any

export const BANG_SELECT_REQUIRED = <T extends any>(x: T): NonNullable<T> => x as any

/**
 * 2024-08-02 domi: nullability of field.value
 * C'est compliqué
 * - c'est très pénible d'avoir des Maybe<...> de partout dans les résultats. Notamment quand on sait que le champ est required.
 * - est en même temps il y a pleins de raisons légitimes qu'il faut gérer qui peuvent faire qu'une value est nulle
 *      - value nullable, id nul
 *      - champ required, id bien non nul, mais on n'a pas encore/plus les infos/contexte pour reconstruire la value
 *      - champ required, id bien non nul, mais plus valide (changement de schema, etc.)
 *      - champ required, mais formulaire pas encore validé, donc value pas garantie d'être valide/non nulle
 * - et en même temps si on a partout des Maybe<...>, on ne va plus réfléchir et traiter tous les
 *      - et du coup pour un schema qui passe de required à nullable, on n'aura pas d'erreur qui apparaît chez nous!
 *
 * => donc c'est pas juste une question de Field_optional
 *
 *
 * On peut aussi faire un parallèle avec un champ texte required:
 *   on ne va pas taper "bonjour" par défaut dans le champ pour qu'il ne soit jamais nul! (ou même '', c'est pénible)
 * On va plutôt avoir un état unsafe et un safe post-validation.
 *
 * On va avoir le même sujet sur des SelectMany quand une liste est vide mais doit avoir > x éléments
 *   (encore moins gérable au type level pour le coup, mais moins fréquent)
 *
 * Solutions:
 * 1. Field_optional: lourd dans la lecture des schemas et dans la manipulation (props forwarding etc...) mais types sympas
 *       rien de particulier encore sur la validation
 * 2. Second type template NULLABLE et safeValue (non-nullable quand le champ est required) dans FieldSelectOne:
 *       voir proto fonctionnel en stash chez Domi, mais encore beaucoup de travail pour propager ce validValue notamment
 * 3. FieldSelectOne et FieldSelectOne_Nullable: pas du tout creusé, peut faire sens
 *       mais assez unsafe sur tous les problèmes de champ required mais value nulle/invalide
 *
 * => ⏳ on va probablement faire ça mieux plus tard au type level,
 *      pour l'instant on part sur quelque chose d'assez safe avec les valeurs nullables et
 *      on peut utiliser BANG_SELECT_REQUIRED quand on sait qu'on est sur un champ required et post-validation pour le moment.
 *      de toute façon tant que la validation est pas plus enforce la safety au type level sera toute relative.
 * => on va quand même commencer à utiliser config.nullable pour de l'UI, de la validation?
 *    à moins qu'on passe par les Field_optional, à tester!
 *    cependant comme maintenant les value des selectOne sont Maybe<...> pour être plus safe, ça s'emboîte moins bien
 */

/**
 * 🤔 another related question is: when do we want to make sure that value (including id) is not stale?
 *     if safety/consistency is important, value should be Maybe even for required fields!
 *    (or maybe this doesn't happen that much/or maybe we can't do anything about it until stuff crashes and we debug
 *       - to finally add some "if null early return" which is not much better than setting it as not-null from the start)
 */
